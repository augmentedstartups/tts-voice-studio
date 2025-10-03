# ⚡ Simple Start Guide

## ✅ Backend is Already Running!

Your backend is now running on: **http://localhost:8000**

---

## 🚀 How to Start Backend (Next Time)

### Copy-Paste These 3 Lines:

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
./start_server.sh
```

**That's literally it!** ✨

---

## 📖 What Each Line Does:

1. **`cd /Users/.../backend`** - Go to backend folder
2. **`lsof -ti:8000 | xargs kill -9 ...`** - Kill any old server (prevents "port in use" error)
3. **`./start_server.sh`** - Start the server

---

## 🎯 Quick Links

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Models List**: http://localhost:8000/api/models

---

## 🛑 To Stop the Server

Press: **`Ctrl + C`** in the terminal

Or kill it:
```bash
lsof -ti:8000 | xargs kill -9
```

---

## 🖥️ Start Frontend

**In a NEW terminal:**

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/frontend
npm run dev
```

**Open**: http://localhost:8080

---

## 📋 Full Workflow

```bash
# Terminal 1 - Backend
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
./start_server.sh

# Terminal 2 - Frontend (NEW terminal)
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/frontend
npm run dev
```

**Done!** Access the app at http://localhost:8080 🎉

---

## 🔧 If Something Goes Wrong

### "Port already in use"
```bash
lsof -ti:8000 | xargs kill -9
```

### "Virtual environment not found"
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
./setup.sh
```

### "Module not found"
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
source .venv/bin/activate
pip install numpy phonemizer soundfile
pip install git+https://github.com/boson-ai/higgs-audio.git
```

---

## 💡 Pro Tip

Create these aliases in `~/.zshrc`:

```bash
# Add to ~/.zshrc
alias tts="cd /Users/riteshkanjee/Documents/dev/tts-voice-studio"
alias tts-backend="cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend && lsof -ti:8000 | xargs kill -9 2>/dev/null; ./start_server.sh"
alias tts-frontend="cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/frontend && npm run dev"
alias tts-stop="lsof -ti:8000 | xargs kill -9"
```

Then reload:
```bash
source ~/.zshrc
```

Now you can just type:
```bash
tts-backend   # Start backend
tts-frontend  # Start frontend (new terminal)
tts-stop      # Stop backend
```

---

**Keep this file open for easy reference!** 📌

