# 🚀 Quick Start

## First Time Setup (Once Only)

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
./setup.sh
```

Wait ~10 minutes for dependencies to install.

---

## Start Backend (Every Time)

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
./start_server.sh
```

**Backend will run on:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

✅ **NeuTTS Air now uses MPS (Apple GPU) for 3-5x faster generation!**

---

## Start Frontend (Optional)

**Open a NEW terminal:**

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/frontend
npm run dev
```

**Frontend will run on:** http://localhost:8080

---

## Stop Server

Press `Ctrl + C` in the terminal, or:

```bash
lsof -ti:8000 | xargs kill -9
```

---

## Available Models

- **Higgs Audio V2**: 7 voices (Belinda, Chadwick, English Man, English Woman, Mabel, Vex, Smart Voice)
- **NeuTTS Air**: 3 voices (Dave, Jo, Ritesh) **[Uses Apple GPU 🚀]**

---

## Troubleshooting

### "Port already in use"
```bash
lsof -ti:8000 | xargs kill -9
```

### "Module not found" errors
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### Start fresh
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
rm -rf .venv
./setup.sh
```

---

**Full documentation**: `docs/` folder
