# 🎤 TTS Voice Studio

A complete, modular text-to-speech system with a modern React frontend and Python backend, supporting multiple state-of-the-art TTS models.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)

## Features

✅ **Multi-Model Support**
- Higgs Audio V2 (5.77B params) - State-of-the-art expressive TTS
- NeuTTS Air - Fast and efficient neural TTS
- Modular architecture for adding new models

✅ **Voice Cloning**
- 10 pre-trained voices (7 for Higgs, 3 for NeuTTS)
- Custom voice training support
- High-quality voice replication

✅ **File Import**
- Support for TXT, PDF, and DOCX files
- Automatic text extraction
- Metadata extraction (word count, pages, etc.)

✅ **Production-Ready API**
- RESTful FastAPI backend
- Auto-generated API documentation
- CORS-enabled for frontend integration

✅ **Modern UI**
- React + TypeScript frontend
- Beautiful gradient design
- Responsive and intuitive

## Quick Start

### One-Command Setup

```bash
git clone <your-repo-url>
cd tts-voice-studio
chmod +x setup.sh
./setup.sh
```

### Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
./start_server.sh
```
🚀 Backend: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
🚀 Frontend: http://localhost:8080

## Project Structure

```
tts-voice-studio/
├── frontend/                 # React + TypeScript UI
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # App pages
│   │   └── config/          # API configuration
│   └── package.json
│
├── backend/                 # FastAPI server
│   ├── main.py             # Server entry point
│   ├── tts_adapters/       # Model adapters
│   ├── utils/              # Utilities
│   ├── config/             # Model configurations
│   └── requirements.txt
│
├── models/                  # Model assets
│   ├── neutts-air/
│   │   └── samples/        # Reference voice samples
│   └── higgs-audio/
│       └── voice_prompts/  # Voice prompt files
│
├── docs/                    # Documentation
├── .venv/                   # Virtual environment (created by setup)
├── .gitignore              # Git ignore rules
├── setup.sh                # One-command setup
└── README.md               # This file
```

## System Requirements

### Minimum
- **OS**: macOS 11+, Linux, Windows (WSL2)
- **RAM**: 16GB
- **Python**: 3.10+
- **Node.js**: 18+

### Recommended
- **RAM**: 32GB+ (48GB ideal for Higgs Audio)
- **GPU**: NVIDIA GPU with CUDA support (optional, CPU works)
- **Storage**: 20GB free space

## Installation

### Prerequisites

1. **Python 3.10+**
   ```bash
   python3 --version
   ```

2. **Node.js 18+**
   ```bash
   node --version
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tts-voice-studio
   ```

2. **Run setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   This will:
   - Create Python virtual environment
   - Install all dependencies
   - Setup frontend and backend
   - Create necessary directories

3. **Verify installation**
   ```bash
   source .venv/bin/activate
   python -c "import neuttsair; import torch; print('✅ All dependencies installed')"
   ```

## Usage

### Starting the Services

#### Backend
```bash
cd backend
./start_server.sh
```

**API Documentation**: http://localhost:8000/docs

#### Frontend
```bash
cd frontend
npm run dev
```

**Application**: http://localhost:8080

### Generating Audio

1. Open http://localhost:8080
2. Select a model (Higgs Audio V2 or NeuTTS Air)
3. Choose a voice
4. Enter text or import a file
5. Click "Generate Voice"
6. Play or download the generated audio

### Available Models

#### Higgs Audio V2 (5.77B params)
- **Voices**: 7 options
- **Quality**: ⭐⭐⭐⭐⭐
- **Speed**: ~30-40s per chunk
- **Best for**: Expressive, natural speech

**Voices:**
- Belinda - Warm female
- Chadwick - Professional male
- English Man - Clear male
- English Woman - Clear female
- Mabel - Energetic female
- Vex - Confident neutral
- Smart Voice - Auto-select

#### NeuTTS Air
- **Voices**: 3 options
- **Quality**: ⭐⭐⭐⭐
- **Speed**: ~5-10s
- **Best for**: Fast generation

**Voices:**
- Dave - Clear male
- Jo - Warm female
- Ritesh - Custom trained

## Development

### Backend Development

```bash
cd backend
source ../.venv/bin/activate
python main.py
```

Visit http://localhost:8000/docs for interactive API testing.

### Frontend Development

```bash
cd frontend
npm run dev
```

Hot module replacement enabled for instant updates.

### Adding New Models

1. Add model configuration to `backend/config/models_config.json`
2. Create model adapter in `backend/tts_adapters/`
3. Register in `backend/main.py`

See `backend/README.md` for detailed instructions.

## API Reference

### List Models
```http
GET /api/models
```

### Get Model Voices
```http
GET /api/models/{model_id}/voices
```

### Generate Audio
```http
POST /api/generate
Content-Type: application/json

{
  "text": "Your text here",
  "voice": "belinda",
  "model": "higgs-audio-v2",
  "settings": {}
}
```

### Extract Text from File
```http
POST /api/extract
Content-Type: multipart/form-data

file: [binary file data]
```

Full API documentation: http://localhost:8000/docs

## Deployment

### Docker (Coming Soon)
```bash
docker-compose up
```

### Production Considerations

1. **Security**
   - Set up authentication
   - Configure HTTPS
   - Update CORS settings

2. **Performance**
   - Use GPU for faster generation
   - Implement request queuing
   - Add caching layer

3. **Monitoring**
   - Setup logging
   - Add health checks
   - Monitor resource usage

## Troubleshooting

### Backend won't start
```bash
# Check dependencies
source .venv/bin/activate
pip install -r backend/requirements.txt

# Check port availability
lsof -i :8000
```

### Frontend connection errors
- Verify backend is running on port 8000
- Check CORS configuration in `backend/main.py`
- Ensure frontend API URL is correct in `frontend/src/config/api.ts`

### Models not loading
- Check available disk space (models download ~5GB)
- Verify internet connection
- Check Hugging Face access

### Generation fails
- Verify sufficient RAM (8-12GB needed)
- Check text length (keep under 500 words)
- Review backend logs for errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Model Licenses

- **Higgs Audio V2**: Apache 2.0 (Boson AI)
- **NeuTTS Air**: Apache 2.0 (Neuphonic)

## Acknowledgments

- [Boson AI](https://boson.ai/) for Higgs Audio V2
- [Neuphonic](https://neuphonic.com/) for NeuTTS Air
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://react.dev/) for the frontend framework
- [Shadcn UI](https://ui.shadcn.com/) for UI components

## Support

- **Documentation**: See `/docs` folder
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions

## Roadmap

### Current (v1.0)
- ✅ Higgs Audio V2 integration
- ✅ NeuTTS Air integration
- ✅ File import (TXT, PDF, DOCX)
- ✅ Voice selection
- ✅ Audio download

### Planned
- [ ] Kokoro v1.0 integration
- [ ] Dia integration
- [ ] Chatterbox integration
- [ ] Batch processing
- [ ] Audio history
- [ ] Voice training interface
- [ ] Docker deployment
- [ ] API authentication
- [ ] Usage analytics

## Performance

### Generation Times
- **NeuTTS Air**: 5-10 seconds
- **Higgs Audio V2**: 30-40 seconds per chunk

### Memory Usage
- **Idle**: ~200MB
- **With models loaded**: 2-3GB
- **During generation**: 4-12GB

### Supported File Sizes
- **Text input**: Up to 10,000 characters
- **PDF import**: Up to 50 pages
- **DOCX import**: Up to 100 pages

---

**Made with ❤️ for voice synthesis enthusiasts**

