# TTS Voice Generation Backend

Modular FastAPI backend for text-to-speech generation with support for multiple TTS models.

## Features

✅ **Multi-Model Support**
- Higgs Audio V2 (5.77B params) - State-of-art expressive TTS
- NeuTTS Air - Fast and efficient neural TTS
- Modular architecture for future models

✅ **File Processing**
- Import TXT, PDF, DOCX files
- Automatic text extraction
- Metadata extraction (word count, pages, etc.)

✅ **Voice Selection**
- Model-specific voices
- Multiple voice profiles per model
- Auto voice selection (Higgs Audio)

✅ **Dynamic Settings**
- Model-specific parameter schemas
- Validation and defaults
- Temperature, top-k, top-p, chunking controls

## Quick Start

### 1. Setup

```bash
chmod +x setup.sh start_server.sh
./setup.sh
```

### 2. Start Server

```bash
./start_server.sh
```

Server runs on: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### 3. Start Frontend

In a separate terminal:

```bash
cd ../augmented-voice-studio
npm install
npm run dev
```

Frontend runs on: **http://localhost:8080**

## API Endpoints

### Get All Models
```http
GET /api/models
```

Returns list of all available TTS models with metadata.

### Get Model Voices
```http
GET /api/models/{model_id}/voices
```

Returns available voices for a specific model.

### Get Model Settings
```http
GET /api/models/{model_id}/settings
```

Returns settings schema for a specific model.

### Generate Voice
```http
POST /api/generate
Content-Type: application/json

{
  "text": "Your text here",
  "voice": "belinda",
  "model": "higgs-audio-v2",
  "settings": {
    "temperature": 0.7,
    "top_k": 50,
    "chunk_method": "word"
  }
}
```

Returns audio file URL.

### Extract Text from File
```http
POST /api/extract
Content-Type: multipart/form-data

file: [binary file data]
```

Returns extracted text and metadata.

### Get Audio File
```http
GET /api/audio/{filename}
```

Downloads generated audio file.

## Project Structure

```
backend/
├── main.py                    # FastAPI server
├── requirements.txt           # Python dependencies
├── setup.sh                   # Setup script
├── start_server.sh           # Start server script
├── config/
│   └── models_config.json    # Model configurations
├── tts_adapters/
│   ├── base_adapter.py       # Base adapter class
│   ├── higgs_adapter.py      # Higgs Audio implementation
│   ├── neutts_adapter.py     # NeuTTS implementation
│   └── __init__.py
├── utils/
│   ├── file_extraction.py    # File processing utilities
│   └── __init__.py
└── temp/
    └── audio/                # Generated audio files
```

## Supported Models

### Active Models

| Model | Parameters | Status | Description |
|-------|-----------|--------|-------------|
| **Higgs Audio V2** | 5.77B | ✅ Active | State-of-art expressive audio |
| **NeuTTS Air** | - | ✅ Active | Fast and efficient neural TTS |

### Planned Models

| Model | Parameters | Provider | License |
|-------|-----------|----------|---------|
| **Kokoro v1.0** | 82M | Hexgrad | Apache 2.0 |
| **Dia** | 1.6B | Nari Labs | Apache 2.0 |
| **Chatterbox** | - | Resemble AI | MIT |
| **Orpheus** | 3B/1B/400M/150M | Canopy Labs | Apache 2.0 |
| **Sesame CSM** | 1B | Sesame | Apache 2.0 |

## Adding New Models

### 1. Add Model Configuration

Edit `config/models_config.json`:

```json
{
  "your-model-id": {
    "id": "your-model-id",
    "name": "Your Model Name",
    "description": "Model description",
    "provider": "Provider Name",
    "status": "planned",
    "maxCharacters": 4096,
    "parameters": "1B",
    "license": "Apache 2.0",
    "settings": {},
    "voices": []
  }
}
```

### 2. Create Adapter

Create `tts_adapters/your_model_adapter.py`:

```python
from .base_adapter import TTSAdapter

class YourModelAdapter(TTSAdapter):
    def __init__(self, model_config):
        super().__init__("your-model-id", model_config)
    
    async def initialize(self) -> bool:
        # Initialize your model
        pass
    
    async def generate(self, text, voice_id, settings):
        # Generate audio
        pass
    
    def get_voices(self):
        return self.model_config.get("voices", [])
    
    def get_settings_schema(self):
        return self.model_config.get("settings", {})
```

### 3. Register in Main

Add to `main.py`:

```python
from tts_adapters import YourModelAdapter

# In lifespan startup:
adapters["your-model-id"] = YourModelAdapter(models_config["your-model-id"])
await adapters["your-model-id"].initialize()
```

## Configuration

### Model Settings Schema

Settings are defined in `models_config.json` per model:

```json
"settings": {
  "temperature": {
    "min": 0.5,
    "max": 2.0,
    "default": 1.0,
    "step": 0.1,
    "description": "Controls randomness"
  },
  "chunk_method": {
    "options": ["none", "word", "speaker"],
    "default": "word",
    "description": "Chunking strategy"
  }
}
```

### Voice Configuration

```json
"voices": [
  {
    "id": "voice-id",
    "name": "Voice Name",
    "description": "Voice description",
    "gender": "male/female/neutral",
    "language": "en-US"
  }
]
```

## Development

### Install Development Dependencies

```bash
pip install fastapi uvicorn python-multipart PyPDF2 python-docx aiofiles
```

### Run with Auto-Reload

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

FastAPI automatically generates interactive API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Model Initialization Fails

Check:
1. Virtual environments for Higgs Audio and NeuTTS exist
2. Models are downloaded and accessible
3. Python paths are correct in adapters

### File Extraction Fails

Ensure dependencies are installed:
```bash
pip install PyPDF2 python-docx
```

### Audio Generation Fails

Check:
1. Model is initialized: `GET /health`
2. Voice is valid for model: `GET /api/models/{model_id}/voices`
3. Settings are valid: `GET /api/models/{model_id}/settings`
4. Text length is within limits

### CORS Issues

Frontend and backend must be on allowed origins. Update in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Add your frontend URL
    ...
)
```

## Performance

### Higgs Audio V2
- First generation: ~30-40 seconds (model loading)
- Subsequent: ~25-35 seconds per chunk
- Memory: ~8-12GB (Mac MPS)
- Device: MPS (Mac), CUDA (GPU), CPU

### NeuTTS Air
- Generation: ~5-10 seconds
- Memory: ~2-4GB
- Device: CPU optimized

## License

See individual model licenses in configuration.

## Support

For issues:
1. Check server logs
2. Verify model initialization: `GET /health`
3. Test with API docs: http://localhost:8000/docs
4. Check frontend console for errors

