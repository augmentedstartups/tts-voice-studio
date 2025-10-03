# Augmented AI Voice Generation - API Documentation

## Overview
This is a modern, minimal text-to-speech front-end application designed to work with local AI models. The application runs on port **8080**.

## Running the Application

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:8080`

## Features

### 1. Voice Selection
- Multiple voice options with descriptions
- Easy dropdown selection
- Voice IDs: aria, nova, echo, sage, luna, atlas

### 2. Model Selection
- Support for different TTS models
- Model options: tts-1, tts-1-hd, whisper-large, custom-local
- Clear descriptions for each model

### 3. Text Editor
- Large, comfortable text input area
- Character counter
- Supports paste and manual input
- Monospace font for better readability

### 4. File Import
- **Supported formats**: TXT, PDF, DOCX
- Currently supports TXT extraction (frontend)
- PDF/DOCX extraction ready for backend integration

### 5. Settings Sidebar
- **Speed Control**: 0.5x - 2.0x
- **Pitch Control**: 0.5 - 1.5
- **Volume Control**: 0% - 100%
- Collapsible sidebar for clean interface

## API Endpoints (Backend Integration)

### Generate Voice
Convert text to speech using selected voice and model.

```http
POST /api/generate
Content-Type: application/json

{
  "text": "Your text here",
  "voice": "aria",
  "model": "tts-1",
  "settings": {
    "speed": 1.0,
    "pitch": 1.0,
    "volume": 100
  }
}
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://your-backend/audio/generated-audio.mp3",
  "duration": 45.2,
  "format": "mp3"
}
```

### List Available Voices
Get all available voices with their descriptions.

```http
GET /api/voices
```

**Response:**
```json
{
  "voices": [
    {
      "id": "aria",
      "name": "Aria",
      "description": "Warm and expressive",
      "language": "en-US",
      "gender": "female"
    }
    // ... more voices
  ]
}
```

### List Available Models
Get all available TTS models.

```http
GET /api/models
```

**Response:**
```json
{
  "models": [
    {
      "id": "tts-1",
      "name": "TTS-1",
      "description": "Fast and efficient",
      "maxCharacters": 4096
    }
    // ... more models
  ]
}
```

### Extract Text from File
Extract text from uploaded PDF or DOCX files.

```http
POST /api/extract
Content-Type: multipart/form-data

file: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted text content...",
  "metadata": {
    "filename": "document.pdf",
    "pages": 5,
    "wordCount": 1250
  }
}
```

## Component Architecture

### Modular Components
```
src/
├── components/
│   ├── VoiceSelector.tsx      # Voice selection dropdown
│   ├── ModelSelector.tsx      # Model selection dropdown
│   ├── TextEditor.tsx         # Main text input area
│   ├── FileImport.tsx         # File upload and text extraction
│   └── SettingsSidebar.tsx    # Settings panel with audio controls
├── pages/
│   └── Index.tsx              # Main application page
└── index.css                  # Design system and theme
```

### Design System
The application uses a comprehensive design system defined in `src/index.css`:

- **Colors**: HSL-based color palette with dark theme
- **Gradients**: Purple-to-blue primary gradient
- **Typography**: Modern sans-serif with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Elegant shadows with glow effects

### Key Design Tokens
```css
--primary: 263 70% 60%           /* Vibrant purple */
--accent: 210 100% 60%           /* Bright blue */
--background: 240 10% 8%         /* Deep dark background */
--gradient-primary               /* Purple-to-blue gradient */
--shadow-glow                    /* Primary color glow effect */
```

## Frontend State Management

### Current Implementation
The application uses React hooks for state management:

```typescript
const [text, setText] = useState("");           // Text content
const [voice, setVoice] = useState("aria");     // Selected voice
const [model, setModel] = useState("tts-1");    // Selected model
const [speed, setSpeed] = useState(1.0);        // Playback speed
const [pitch, setPitch] = useState(1.0);        // Audio pitch
const [volume, setVolume] = useState(100);      // Output volume
```

## Integration Guide

### 1. Backend Setup
Create endpoints matching the API documentation above in your backend service.

### 2. Update API Base URL
Modify the fetch calls in `src/pages/Index.tsx` to point to your backend:

```typescript
const API_BASE_URL = "http://localhost:YOUR_PORT";
```

### 3. File Extraction
Integrate PDF/DOCX extraction in `src/components/FileImport.tsx`:

```typescript
// Replace placeholder with actual API call
const response = await fetch(`${API_BASE_URL}/api/extract`, {
  method: 'POST',
  body: formData
});
const { text } = await response.json();
onTextExtracted(text);
```

### 4. Voice Generation
Implement the generation logic in `src/pages/Index.tsx`:

```typescript
const response = await fetch(`${API_BASE_URL}/api/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text,
    voice,
    model,
    settings: { speed, pitch, volume }
  })
});
```

## Development

### Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn UI** for components
- **Radix UI** for primitives

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Environment Configuration
The app runs on port **8080**.

## Future Enhancements

### Planned Features
- [ ] Audio playback controls
- [ ] Download generated audio
- [ ] Audio history/library
- [ ] Batch processing
- [ ] Custom voice training integration
- [ ] Real-time preview
- [ ] Advanced text formatting options
- [ ] Export settings presets

## Support

For issues or questions, refer to the inline component documentation or check the console logs for detailed debugging information.
