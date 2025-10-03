import sys
import os
import subprocess
from pathlib import Path
from typing import Dict, Any, List
import uuid
import asyncio

from .base_adapter import TTSAdapter

# Point to the old working higgs-audio repository
HIGGS_AUDIO_PATH = Path("/Users/riteshkanjee/Documents/dev/neurotts/higgs-audio")

class HiggsAudioAdapter(TTSAdapter):
    """Adapter for Higgs Audio V2 model"""
    
    def __init__(self, model_config: Dict[str, Any]):
        super().__init__("higgs-audio-v2", model_config)
        self.venv_python = HIGGS_AUDIO_PATH / "higgs_venv" / "bin" / "python3"
        self.generation_script = HIGGS_AUDIO_PATH / "examples" / "generation.py"
        self.output_dir = Path(__file__).parent.parent / "temp" / "audio"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    async def initialize(self) -> bool:
        """Initialize Higgs Audio model"""
        if not self.venv_python.exists():
            raise FileNotFoundError(f"Higgs Audio venv not found at {self.venv_python}")
        
        if not self.generation_script.exists():
            raise FileNotFoundError(f"Generation script not found at {self.generation_script}")
        
        self.model = True
        return True
    
    async def generate(
        self,
        text: str,
        voice_id: str,
        settings: Dict[str, Any]
    ) -> Path:
        """Generate speech using Higgs Audio"""
        
        validated_settings = self.validate_settings(settings)
        
        output_filename = f"higgs_{uuid.uuid4().hex[:8]}.wav"
        output_path = self.output_dir / output_filename
        
        temp_input_file = self.output_dir / f"input_{uuid.uuid4().hex[:8]}.txt"
        temp_input_file.write_text(text, encoding="utf-8")
        
        cmd = [
            str(self.venv_python),
            str(self.generation_script),
            "--transcript", str(temp_input_file),
            "--out_path", str(output_path),
            "--temperature", str(validated_settings.get("temperature", 0.7)),
            "--top_k", str(validated_settings.get("top_k", 50)),
            "--top_p", str(validated_settings.get("top_p", 0.95)),
            "--max_new_tokens", str(validated_settings.get("max_new_tokens", 1024)),
        ]
        
        if voice_id != "auto":
            cmd.extend(["--ref_audio", voice_id])
        
        chunk_method = validated_settings.get("chunk_method", "word")
        if chunk_method != "none":
            cmd.extend(["--chunk_method", chunk_method])
            
        if chunk_method == "word":
            cmd.extend(["--chunk_max_word_num", str(validated_settings.get("chunk_max_word_num", 100))])
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(HIGGS_AUDIO_PATH)
        )
        
        stdout, stderr = await process.communicate()
        
        temp_input_file.unlink(missing_ok=True)
        
        if process.returncode != 0:
            error_msg = stderr.decode() if stderr else "Unknown error"
            raise RuntimeError(f"Higgs Audio generation failed: {error_msg}")
        
        if not output_path.exists():
            raise RuntimeError("Audio file was not generated")
        
        return output_path
    
    def get_voices(self) -> List[Dict[str, Any]]:
        """Get available voices"""
        return self.model_config.get("voices", [])
    
    def get_settings_schema(self) -> Dict[str, Any]:
        """Get settings schema"""
        return self.model_config.get("settings", {})

