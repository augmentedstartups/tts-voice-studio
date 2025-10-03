#!/bin/bash

API_URL="http://localhost:8000"

echo "🧪 Testing TTS Backend API..."
echo ""

echo "1️⃣ Testing health check..."
curl -s "$API_URL/health" | python3 -m json.tool
echo ""

echo "2️⃣ Testing list models..."
curl -s "$API_URL/api/models" | python3 -m json.tool
echo ""

echo "3️⃣ Testing Higgs Audio voices..."
curl -s "$API_URL/api/models/higgs-audio-v2/voices" | python3 -m json.tool
echo ""

echo "4️⃣ Testing NeuTTS voices..."
curl -s "$API_URL/api/models/neutts-air/voices" | python3 -m json.tool
echo ""

echo "5️⃣ Testing Higgs Audio settings..."
curl -s "$API_URL/api/models/higgs-audio-v2/settings" | python3 -m json.tool
echo ""

echo "✅ API tests complete!"
echo ""
echo "To test generation, use the frontend at http://localhost:8080"
echo "Or use curl:"
echo ""
echo 'curl -X POST "$API_URL/api/generate" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{'
echo '    "text": "Hello world",
echo '    "voice": "belinda",
echo '    "model": "higgs-audio-v2",
echo '    "settings": {"temperature": 0.7}
echo '  }'"'"

