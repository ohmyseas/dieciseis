# Dieciséis TTS Setup Guide

This document describes the ElevenLabs TTS + Vercel KV integration for professional Spanish voice synthesis.

## Architecture

### Components

1. **Frontend (index.html)**
   - Settings modal UI for API key input
   - Updated `speak()` function with ElevenLabs API support
   - Client-side audio caching
   - Graceful fallback to Web Speech API

2. **Backend API Routes**
   - `/api/speak.js` — ElevenLabs TTS proxy (streams audio)
   - `/api/settings.js` — Vercel KV settings manager

3. **Storage**
   - Vercel KV: Persistent API keys + preferences (30-day TTL)
   - localStorage: Device ID for cross-device sync
   - Client memory: Audio cache for repeated words

## Setup Instructions

### 1. Get ElevenLabs API Key

1. Sign up at https://elevenlabs.io
2. Create free account (free tier includes 10k characters/month)
3. Go to Account → API Keys
4. Copy your API key (starts with `sk-`)

### 2. Deploy to Vercel with KV

```bash
cd /d/Projects/dieciseis

# Install dependencies
npm install

# Deploy to Vercel
vercel deploy --prod
```

### 3. Configure Vercel KV in Dashboard

1. Go to https://vercel.com/dashboard
2. Select the Dieciséis project
3. Storage tab → Create Database → Vercel KV
4. Name it `dieciseis-kv`
5. This auto-populates `@vercel/kv` in your project

### 4. Set Environment Variable (Optional)

For server-side API key (more secure), add to Vercel project settings:
```
ELEVENLABS_API_KEY=sk-your-key-here
```

Otherwise, users can enter their own API key via Settings modal.

## Usage

### First Time Setup (Desktop or Mobile)

1. Open https://dieciseis.vercel.app
2. Click ⚙ (Settings) in top right
3. Enter your ElevenLabs API key
4. Select preferred voice:
   - **Lola** — Spain Spanish, female (recommended)
   - **Pablo** — Spain Spanish, male
   - **Diego** — Latin American Spanish, male
   - **Lucia** — Latin American Spanish, female
5. Click "Save & Test" to verify voice works

### Cross-Device Sync

- Settings are stored in Vercel KV with your device ID
- Open app on phone/tablet → settings auto-load from server
- No re-entry needed across devices

### Fallback Behavior

If ElevenLabs fails or API key missing:
- App automatically falls back to Web Speech API
- Users can still learn, just with system voice

## API Endpoints

### POST /api/speak
Streams audio from ElevenLabs

**Request:**
```json
{
  "text": "Hola, cómo estás?",
  "voiceId": "lola",
  "lang": "es-ES"
}
```

**Response:**
- Success: MP3 audio stream (Content-Type: audio/mpeg)
- Failure: JSON error + `fallbackToWebSpeech: true` flag

### GET/POST /api/settings
Manages user settings via Vercel KV

**GET:**
- Returns user's saved API key + voice preferences

**POST:**
- Saves API key + voice selection
- TTL: 30 days (auto-expires if inactive)

## Troubleshooting

### Settings Not Syncing
- Check browser DevTools → Network tab
- Verify Vercel KV is connected in project settings
- Clear localStorage: `localStorage.clear()` in console

### No Audio Output
1. Check browser console for errors
2. Verify API key is valid
3. Try Web Speech fallback (disable ElevenLabs)
4. Test with simple word: "hola"

### ElevenLabs Rate Limited
- Free tier: 10k characters/month (~100 vocabulary words)
- Upgrade to paid plan for unlimited access
- Cache limits requests (same word only calls API once per session)

## Cost Estimates

| Plan | Monthly | Cost per 1k chars |
|------|---------|-------------------|
| Free | 10k chars | $0 |
| Starter | 100k chars | $5/month |
| Pro | 1M chars | $4.99/100k chars |

**Dieciséis usage:** ~50-100 characters per drill (~2-4 drills per lesson) = ~50-200 chars per session. Free tier sufficient for casual use.

## Files Changed

- `index.html` — Added settings modal, updated speak() function
- `api/speak.js` — New TTS proxy endpoint
- `api/settings.js` — New settings manager endpoint
- `package.json` — Added @vercel/kv dependency
- `vercel.json` — Already configured for Vercel deployment

## Security Notes

- API key stored server-side in Vercel KV (never sent to browser)
- Device ID used as session identifier (no auth required)
- KV entries auto-expire after 30 days of inactivity
- CORS enabled for cross-origin requests

## Next Steps

1. **Test end-to-end:** https://dieciseis.vercel.app → Settings → Enter API key → Drill
2. **Test cross-device:** Open on mobile, verify settings load
3. **Monitor ElevenLabs usage** at https://elevenlabs.io/app/dashboard
4. **Optional:** Upgrade plan if usage exceeds free tier

---

Questions? Check ElevenLabs docs: https://elevenlabs.io/docs
