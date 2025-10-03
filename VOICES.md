# 🎤 Available Voices

## Higgs Audio V2 (17 voices total)

### English Voices

#### Standard Voices
1. **Belinda** - Warm and expressive female voice
2. **Chadwick** - Professional male voice
3. **English Man** - Clear male voice
4. **English Woman** - Clear female voice
5. **Mabel** - Bright and energetic female voice
6. **Vex** - Strong and confident neutral voice

#### Character Voices (Big Bang Theory)
7. **Amy (Big Bang)** - Enthusiastic female scientist voice
8. **Sheldon (Big Bang)** - Precise male scientist voice

#### Character Voices (Shrek)
9. **Donkey (Shrek)** - Funny and energetic character voice
10. **Fiona (Shrek)** - Princess character voice
11. **Shrek** - Gruff ogre character voice

#### Character Voices (Other)
12. **Anna (Fifty Shades)** - Soft and gentle female voice
13. **Broom Salesman** - Energetic salesperson voice

### Spanish Voices
14. **Donkey Spanish (Shrek)** - Spanish version of Donkey

### Chinese Voices
15. **Ma Baoguo** - Traditional Chinese male voice
16. **Sichuan Man** - Sichuan dialect male voice

### AI Voice
17. **Smart Voice** - AI automatically selects appropriate voice based on text

---

## NeuTTS Air (3 voices)

1. **Dave** - Male voice with clear articulation (MPS GPU accelerated 🚀)
2. **Jo** - Female voice with warm tone (MPS GPU accelerated 🚀)
3. **Ritesh** - Custom trained voice (MPS GPU accelerated 🚀)

---

## Usage

### Frontend
Select any voice from the dropdown menu in the UI.

### API
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "voice": "shrek_donkey",
    "model": "higgs-audio-v2",
    "settings": {
      "temperature": 0.7,
      "top_k": 50
    }
  }'
```

### Voice IDs
Use these exact IDs in API calls:
- `belinda`, `chadwick`, `en_man`, `en_woman`, `mabel`, `vex`
- `bigbang_amy`, `bigbang_sheldon`
- `shrek_donkey`, `shrek_donkey_es`, `shrek_fiona`, `shrek_shrek`
- `fiftyshades_anna`, `broom_salesman`
- `mabaoguo`, `zh_man_sichuan`
- `auto` (Smart Voice)
- `dave`, `jo`, `ritesh` (NeuTTS)

---

**Total**: 20 unique voices across 2 models!
