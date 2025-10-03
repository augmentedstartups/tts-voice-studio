import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from tts_adapters import HiggsAudioAdapter, NeuTTSAdapter
from utils import extract_text_from_file

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

adapters: Dict[str, Any] = {}
models_config: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global adapters, models_config
    
    logger.info("Starting TTS backend server...")
    
    config_path = Path(__file__).parent / "config" / "models_config.json"
    with open(config_path, "r") as f:
        models_config = json.load(f)["models"]
    
    adapters["higgs-audio-v2"] = HiggsAudioAdapter(models_config["higgs-audio-v2"])
    adapters["neutts-air"] = NeuTTSAdapter(models_config["neutts-air"])
    
    for model_id, adapter in adapters.items():
        if models_config[model_id]["status"] == "active":
            try:
                await adapter.initialize()
                logger.info(f"✅ Initialized {model_id}")
            except Exception as e:
                logger.error(f"❌ Failed to initialize {model_id}: {e}")
    
    yield
    
    logger.info("Shutting down TTS backend server...")

app = FastAPI(
    title="TTS Voice Generation API",
    description="Modular text-to-speech API with support for multiple models",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080",
        "http://localhost:8081", 
        "http://127.0.0.1:8081",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    text: str
    voice: str
    model: str
    settings: Optional[Dict[str, Any]] = None

class GenerateResponse(BaseModel):
    success: bool
    audioUrl: str
    duration: Optional[float] = None
    format: str = "wav"
    model: str
    voice: str

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "TTS Voice Generation API",
        "version": "1.0.0",
        "status": "running",
        "active_models": [
            model_id for model_id, config in models_config.items()
            if config["status"] == "active"
        ]
    }

@app.get("/api/models")
async def list_models():
    """List all available models"""
    return {
        "models": [
            {
                "id": model_id,
                "name": config["name"],
                "description": config["description"],
                "provider": config["provider"],
                "status": config["status"],
                "maxCharacters": config["maxCharacters"],
                "parameters": config.get("parameters"),
                "license": config.get("license"),
                "voiceCount": len(config.get("voices", []))
            }
            for model_id, config in models_config.items()
        ]
    }

@app.get("/api/models/{model_id}/voices")
async def list_model_voices(model_id: str):
    """List voices for a specific model"""
    if model_id not in models_config:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    
    if model_id not in adapters:
        return {"voices": []}
    
    adapter = adapters[model_id]
    return {"voices": adapter.get_voices()}

@app.get("/api/models/{model_id}/settings")
async def get_model_settings(model_id: str):
    """Get settings schema for a specific model"""
    if model_id not in models_config:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    
    if model_id not in adapters:
        return {"settings": {}}
    
    adapter = adapters[model_id]
    return {"settings": adapter.get_settings_schema()}

@app.get("/api/voices")
async def list_all_voices():
    """List all available voices across all models"""
    all_voices = []
    
    for model_id, adapter in adapters.items():
        if models_config[model_id]["status"] == "active":
            voices = adapter.get_voices()
            for voice in voices:
                all_voices.append({
                    **voice,
                    "model": model_id,
                    "modelName": models_config[model_id]["name"]
                })
    
    return {"voices": all_voices}

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_voice(request: GenerateRequest):
    """Generate voice from text"""
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if request.model not in adapters:
        raise HTTPException(status_code=404, detail=f"Model {request.model} not found")
    
    adapter = adapters[request.model]
    
    if not adapter.is_initialized():
        raise HTTPException(
            status_code=503,
            detail=f"Model {request.model} is not initialized"
        )
    
    if not adapter.validate_voice(request.voice):
        raise HTTPException(
            status_code=400,
            detail=f"Voice {request.voice} not available for model {request.model}"
        )
    
    try:
        settings = request.settings or {}
        
        output_path = await adapter.generate(
            text=request.text,
            voice_id=request.voice,
            settings=settings
        )
        
        audio_filename = output_path.name
        audio_url = f"/api/audio/{audio_filename}"
        
        return GenerateResponse(
            success=True,
            audioUrl=audio_url,
            format="wav",
            model=request.model,
            voice=request.voice
        )
    
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/api/extract")
async def extract_file_text(file: UploadFile = File(...)):
    """Extract text from uploaded file"""
    
    allowed_extensions = [".txt", ".pdf", ".docx", ".doc"]
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        content = await file.read()
        result = await extract_text_from_file(content, file.filename)
        
        return {
            "success": True,
            **result
        }
    
    except Exception as e:
        logger.error(f"File extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.get("/api/audio/{filename}")
async def get_audio_file(filename: str):
    """Serve generated audio file"""
    audio_dir = Path(__file__).parent / "temp" / "audio"
    file_path = audio_dir / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=file_path,
        media_type="audio/wav",
        filename=filename
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    active_models = {}
    for model_id, adapter in adapters.items():
        active_models[model_id] = {
            "initialized": adapter.is_initialized(),
            "status": models_config[model_id]["status"]
        }
    
    return {
        "status": "healthy",
        "models": active_models
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

