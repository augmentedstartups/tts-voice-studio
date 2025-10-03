# 🎉 TTS Voice Studio - Changelog

## Latest Updates (October 3, 2025)

### ✨ UI Improvements

#### Generation Time Display
- **Added** discreet generation time tracker
- Shows time taken in seconds with clock icon
- Displayed next to "Generated Audio" heading
- Automatically resets on new generation
- Also shows in toast notification

#### Collapsible API Guide
- **Made** API Integration Guide expandable/collapsible
- Starts collapsed by default
- Click to expand when needed
- Smooth animation with chevron indicator
- Updated API examples to match actual endpoints

### 🎤 Voice Library Expansion

#### Added 10 New Higgs Audio Voices
- **Big Bang Theory Characters**: Amy, Sheldon
- **Shrek Characters**: Donkey (English & Spanish), Fiona, Shrek
- **Other Characters**: Anna (Fifty Shades), Broom Salesman
- **Chinese Voices**: Ma Baoguo, Sichuan Man

**Total**: 17 Higgs Audio voices + 3 NeuTTS voices = **20 voices**

### 🚀 Performance

#### MPS GPU Acceleration
- **Enabled** Apple Metal (MPS) GPU for NeuTTS Air
- 3-5x faster generation on Apple Silicon Macs
- Auto-detection: MPS > CUDA > CPU
- Average generation time: ~6 seconds (was ~15-20s)

#### Fixed Dependencies
- **Replaced** incorrect `perth` package with `audioseal`
- **Made** watermarking optional (non-critical feature)
- **Added** all required dependencies to `requirements.txt`

### 📚 Documentation

#### Added Files
- `QUICKSTART.md` - Simple 3-step start guide
- `VOICES.md` - Complete voice catalog
- `CHANGELOG.md` - This file
- `GITHUB_INFO.md` - Repository details

#### Organized Structure
- Moved all detailed docs to `docs/` folder
- Kept only `README.md` and `QUICKSTART.md` in root
- Clean, easy-to-navigate structure

### 🐛 Bug Fixes

#### Backend
- Fixed NeuTTS initialization errors
- Fixed port conflicts with kill script
- Fixed model adapter paths
- Fixed watermarking crashes

#### Frontend
- Updated voice selection to use new voices
- Fixed API endpoint references
- Improved error messages

---

## Feature Highlights

### Generation Time Display
```
┌─────────────────────────────────┐
│ Generated Audio        ⏱️ 6.2s  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [Audio Player]                  │
└─────────────────────────────────┘
```

### Collapsible API Guide
```
┌──────────────────────────────┐
│ API Integration Guide    ▼   │ ← Click to expand
├──────────────────────────────┤
│ POST /api/generate           │
│ GET /api/models              │
│ GET /api/models/{id}/voices  │
│ ...                          │
└──────────────────────────────┘
```

---

## Statistics

- **Total Commits**: 15+
- **Files Changed**: 50+
- **Lines Added**: 2000+
- **Documentation**: 8 markdown files
- **Voices**: 20 total (17 Higgs + 3 NeuTTS)
- **Models**: 2 active (5 planned)
- **Dependencies**: All pinned and tested

---

## Next Steps (Planned)

### Future Models
- Kokoro v1.0 (82M params)
- Dia (1.6B params)
- Chatterbox
- Orpheus (multi-size)
- Sesame CSM (1B params)

### Future Features
- Voice cloning with custom samples
- Batch processing
- Audio history
- Export to multiple formats
- API authentication
- Usage analytics

---

## Links

- **GitHub**: https://github.com/augmentedstartups/tts-voice-studio
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:8080
- **API Docs**: http://localhost:8000/docs

