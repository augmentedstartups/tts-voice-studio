#!/bin/bash

cd "$(dirname "$0")"

# Find and use root .venv
ROOT_DIR="$(cd .. && pwd)"
VENV_PATH="$ROOT_DIR/.venv"

if [ ! -d "$VENV_PATH" ]; then
    echo "❌ Virtual environment not found at $VENV_PATH"
    echo "Please run ./setup.sh from the root directory first"
    exit 1
fi

source "$VENV_PATH/bin/activate"

echo "🎤 Starting TTS Backend Server..."
echo "📍 Server will run on: http://localhost:8000"
echo "📖 API docs: http://localhost:8000/docs"
echo ""

python main.py

