#!/bin/bash

echo "🚀 Setting up TTS Backend..."

# Find root .venv
ROOT_DIR="$(cd .. && pwd)"
ROOT_VENV="$ROOT_DIR/.venv"

if [ ! -d "$ROOT_VENV" ]; then
    echo "❌ Root .venv not found at $ROOT_VENV"
    echo "Please run the root setup.sh first"
    exit 1
fi

echo "📥 Installing backend dependencies..."
source "$ROOT_VENV/bin/activate"
pip install -r requirements.txt

mkdir -p temp/audio
mkdir -p config

echo "✅ Backend setup complete!"
echo ""
echo "To start the server:"
echo "  ./start_server.sh"

