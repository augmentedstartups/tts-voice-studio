from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from pathlib import Path

class TTSAdapter(ABC):
    """Base class for all TTS model adapters"""
    
    def __init__(self, model_id: str, model_config: Dict[str, Any]):
        self.model_id = model_id
        self.model_config = model_config
        self.model = None
        
    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize the TTS model"""
        pass
    
    @abstractmethod
    async def generate(
        self,
        text: str,
        voice_id: str,
        settings: Dict[str, Any]
    ) -> Path:
        """
        Generate speech from text
        
        Args:
            text: Text to convert to speech
            voice_id: Voice identifier
            settings: Model-specific settings
            
        Returns:
            Path to generated audio file
        """
        pass
    
    @abstractmethod
    def get_voices(self) -> List[Dict[str, Any]]:
        """Get available voices for this model"""
        pass
    
    @abstractmethod
    def get_settings_schema(self) -> Dict[str, Any]:
        """Get settings schema for this model"""
        pass
    
    def is_initialized(self) -> bool:
        """Check if model is initialized"""
        return self.model is not None
    
    def validate_voice(self, voice_id: str) -> bool:
        """Validate if voice is available"""
        voices = self.get_voices()
        return any(v["id"] == voice_id for v in voices)
    
    def validate_settings(self, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and apply defaults to settings"""
        schema = self.get_settings_schema()
        validated = {}
        
        for key, config in schema.items():
            if key in settings:
                value = settings[key]
                
                if "min" in config and "max" in config:
                    value = max(config["min"], min(config["max"], value))
                elif "options" in config:
                    if value not in config["options"]:
                        value = config["default"]
                        
                validated[key] = value
            else:
                validated[key] = config.get("default")
                
        return validated

