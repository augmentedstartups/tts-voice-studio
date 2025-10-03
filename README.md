# 🎤 TTS Voice Studio

Complete text-to-speech system with React frontend + FastAPI backend.

**GitHub**: https://github.com/augmentedstartups/tts-voice-studio

---

## ⚡ Quick Start

### 1. First Time Setup

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
./setup.sh
```

Wait ~10 minutes for dependencies.

### 2. Start Backend

```bash
cd backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
./start_server.sh
```

✅ Backend: http://localhost:8000

### 3. Start Frontend (Optional)

**New terminal:**

```bash
cd frontend
npm run dev
```

✅ Frontend: http://localhost:8080

---

## 📊 Models

- **Higgs Audio V2**: 7 voices
- **NeuTTS Air**: 3 voices

---

## 📚 Documentation

See `docs/` folder for full guides.

---

## 🛑 Stop Server

Press `Ctrl + C` or:

```bash
lsof -ti:8000 | xargs kill -9
```
