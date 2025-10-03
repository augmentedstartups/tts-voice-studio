import sys
from pathlib import Path
from typing import Dict, Any, List
import uuid
import torchaudio

from .base_adapter import TTSAdapter

NEUTTS_PATH = Path(__file__).parent.parent.parent / "models" / "neutts-air"

class NeuTTSAdapter(TTSAdapter):
    """Adapter for NeuTTS Air model"""
    
    def __init__(self, model_config: Dict[str, Any]):
        super().__init__("neutts-air", model_config)
        self.output_dir = Path(__file__).parent.parent / "temp" / "audio"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.samples_dir = NEUTTS_PATH / "samples"
        
    async def initialize(self) -> bool:
        """Initialize NeuTTS model"""
        try:
            # NeuTTS is installed via pip in the virtual environment
            from neuttsair.neutts import NeuTTSAir
            
            self.model = NeuTTSAir(
                backbone_repo="neuphonic/neutts-air",
                backbone_device="cpu",
                codec_repo="neuphonic/neucodec",
                codec_device="cpu"
            )
            
            return True
        except Exception as e:
            raise RuntimeError(f"Failed to initialize NeuTTS: {str(e)}")
    
    async def generate(
        self,
        text: str,
        voice_id: str,
        settings: Dict[str, Any]
    ) -> Path:
        """Generate speech using NeuTTS"""
        if not self.is_initialized():
            await self.initialize()
        
        validated_settings = self.validate_settings(settings)
        
        ref_audio_path = self.samples_dir / f"{voice_id}.wav"
        ref_text_path = self.samples_dir / f"{voice_id}.txt"
        
        if not ref_audio_path.exists():
            raise ValueError(f"Reference audio not found for voice: {voice_id}")
        
        if ref_text_path.exists():
            ref_text = ref_text_path.read_text(encoding="utf-8").strip()
        else:
            ref_text = "This is a sample reference text."
        
        output_filename = f"neutts_{uuid.uuid4().hex[:8]}.wav"
        output_path = self.output_dir / output_filename
        
        # Encode reference audio
        ref_codes = self.model.encode_reference(str(ref_audio_path))
        
        # Generate audio
        waveform = self.model.infer(text, ref_codes, ref_text)
        
        # Save using soundfile (since waveform is already numpy array)
        import soundfile as sf
        sf.write(str(output_path), waveform, 24000)
        
        return output_path
    
    def get_voices(self) -> List[Dict[str, Any]]:
        """Get available voices"""
        return self.model_config.get("voices", [])
    
    def get_settings_schema(self) -> Dict[str, Any]:
        """Get settings schema"""
        return self.model_config.get("settings", {})

