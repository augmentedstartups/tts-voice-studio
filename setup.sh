#!/bin/bash

echo "🚀 TTS Voice Studio - Monorepo Setup"
echo "======================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check Python version
echo "📋 Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "   Found Python $PYTHON_VERSION"

# Create virtual environment
if [ ! -d ".venv" ]; then
    echo ""
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
else
    echo ""
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔌 Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo ""
echo "📥 Upgrading pip..."
pip install --upgrade pip

# Install neutts-air package
echo ""
echo "📦 Installing NeuTTS Air..."
# Check if neutts-air is already installed
if ! python -c "import neuttsair" 2>/dev/null; then
    # Install from PyPI or local if available
    pip install neutts-air || echo "⚠️  NeuTTS Air not found on PyPI. Will install from source if needed."
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
mkdir -p temp/audio
mkdir -p config
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if command -v npm &> /dev/null; then
    npm install
else
    echo "⚠️  npm not found. Please install Node.js to setup the frontend."
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "======================================"
echo "📚 Next Steps:"
echo "======================================"
echo ""
echo "1. Start Backend:"
echo "   cd backend && ./start_server.sh"
echo "   Backend will run on: http://localhost:8000"
echo ""
echo "2. Start Frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo "   Frontend will run on: http://localhost:8080"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:8080"
echo ""
echo "======================================"
echo "📖 Documentation: README.md"
echo "======================================"

