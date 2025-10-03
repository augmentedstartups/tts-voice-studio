# 🚀 Running the Backend (Error-Free)

## Quick Start (3 Commands)

```bash
# 1. Go to backend directory
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend

# 2. Kill any existing server on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# 3. Start the server
./start_server.sh
```

That's it! ✅

---

## Common Error: "address already in use"

### The Problem
```
ERROR: [Errno 48] error while attempting to bind on address ('0.0.0.0', 8000): address already in use
```

**Why?** A previous server is still running on port 8000.

### The Solution (Copy-Paste This)

```bash
# Kill existing server (safe to run even if nothing is running)
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Now start the server
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
./start_server.sh
```

---

## Step-by-Step Instructions

### 1️⃣ First Time Setup (Once Only)

```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
./setup.sh
```

Wait for it to complete (~5 minutes).

### 2️⃣ Start Backend (Every Time)

**Option A - Using the Script (Recommended):**
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
./start_server.sh
```

**Option B - Manual:**
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
source ../.venv/bin/activate
python main.py
```

### 3️⃣ Verify It's Running

Open in browser: http://localhost:8000/docs

You should see the API documentation.

### 4️⃣ Stop the Server

Press: `Ctrl + C`

---

## Troubleshooting

### Problem: "Port already in use"

**Solution:**
```bash
# Kill the process
lsof -ti:8000 | xargs kill -9

# Or if that doesn't work
pkill -9 -f "python main.py"
```

### Problem: "No module named..."

**Solution:**
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
source .venv/bin/activate
cd backend
pip install -r requirements.txt
```

### Problem: "Virtual environment not found"

**Solution:**
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio
./setup.sh
```

### Problem: Server starts but crashes immediately

**Check logs:**
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
source ../.venv/bin/activate
python main.py
# Read the error message
```

---

## Best Practices

### ✅ DO:
- Always kill existing servers before starting a new one
- Use `./start_server.sh` (it handles activation automatically)
- Keep terminal open while server is running
- Use `Ctrl + C` to stop gracefully

### ❌ DON'T:
- Don't close terminal without stopping server (`Ctrl + C` first)
- Don't run multiple instances
- Don't use the old `/neurotts/backend` directory (use new monorepo)

---

## One-Command Server Management

### Create an alias (optional):
```bash
# Add to ~/.zshrc
alias tts-start="cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend && lsof -ti:8000 | xargs kill -9 2>/dev/null || true && ./start_server.sh"
alias tts-stop="lsof -ti:8000 | xargs kill -9"
```

Then just run:
```bash
tts-start  # Start server
tts-stop   # Stop server
```

---

## Testing the Backend

### Quick Health Check:
```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

### List Available Models:
```bash
curl http://localhost:8000/api/models
```

### Full Test:
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
./test_api.sh
```

---

## Server Status

### Check if Running:
```bash
lsof -i:8000
```

If you see output → Server is running  
If no output → Server is stopped

### View Process:
```bash
ps aux | grep "python main.py"
```

---

## Clean Start (Nuclear Option)

If everything is broken:

```bash
# 1. Kill everything on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null
pkill -9 -f "python main.py"
pkill -9 -f "uvicorn"

# 2. Go to monorepo
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio

# 3. Recreate virtual environment
rm -rf .venv
./setup.sh

# 4. Start fresh
cd backend
./start_server.sh
```

---

## Running Both Frontend & Backend

### Terminal 1 (Backend):
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/backend
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
./start_server.sh
```

### Terminal 2 (Frontend):
```bash
cd /Users/riteshkanjee/Documents/dev/tts-voice-studio/frontend
npm run dev
```

**Access**: http://localhost:8080

---

## Quick Reference Card

```
📍 Monorepo Location:
   /Users/riteshkanjee/Documents/dev/tts-voice-studio/

🚀 Start Backend:
   cd backend && ./start_server.sh

🛑 Stop Backend:
   Ctrl + C (or: lsof -ti:8000 | xargs kill -9)

🏥 Health Check:
   curl http://localhost:8000/health

📚 API Docs:
   http://localhost:8000/docs

💻 Frontend:
   cd frontend && npm run dev
   http://localhost:8080
```

---

**Pro Tip**: Keep this file open in a separate window for quick reference! 📌

