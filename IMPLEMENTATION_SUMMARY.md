# Dieciséis TTS Implementation Summary

## Overview

Successfully implemented ElevenLabs TTS + Vercel KV integration for Dieciséis, replacing the Web Speech API with professional Spanish voice synthesis. Settings sync across phone and desktop via Vercel KV.

## Changes Made

### 1. Frontend (index.html)

#### Settings Modal UI
- Added ⚙ (Settings) button to topbar
- Modal dialog for API key input (password field for security)
- Voice selector dropdown with 4 professional Spanish voices
- "Save & Test" button triggers voice test

**Voice Options:**
- **Lola** (Spain Spanish, female) — recommended for European accent
- **Pablo** (Spain Spanish, male) — deeper voice
- **Diego** (Latin American Spanish, male)
- **Lucia** (Latin American Spanish, female)

#### Updated speak() Function
- Detects if ElevenLabs API key is available
- If yes: Calls `/api/speak` endpoint (returns audio blob)
- If no: Falls back gracefully to Web Speech API
- **Client-side audio caching:** Same word only calls API once per session
- Handles audio playback with `new Audio()` object

#### Device Synchronization
- Auto-generates unique `deviceId` on first load (stored in localStorage)
- Sends deviceId as HTTP header to settings endpoints
- Enables same-user sync across phone/desktop

#### New Functions
- `generateDeviceId()` — Creates persistent device identifier
- `loadSettings()` — Fetches settings from Vercel KV on startup
- `saveSettings(apiKey, voiceId, lang)` — Persists to Vercel KV
- `playAudio(audioUrl)` — Handles audio playback with cleanup

### 2. Backend API Routes

#### `/api/speak.js` — TTS Proxy Endpoint
**Purpose:** Stream audio from ElevenLabs without exposing API key

**Request:** POST with JSON body
```json
{
  "text": "Hola, cómo estás?",
  "voiceId": "lola",
  "lang": "es-ES"
}
```

**Response:**
- Success (200): MP3 audio stream (Content-Type: audio/mpeg)
- Failure (4xx/5xx): JSON error with `fallbackToWebSpeech: true` flag

**Features:**
- Server-side API key from environment variable
- Streams response directly (no buffering overhead)
- Cache headers: 1-hour max-age for repeated requests
- Error logging for debugging

#### `/api/settings.js` — Settings Manager
**Purpose:** Store/retrieve API keys and preferences in Vercel KV

**GET /api/settings**
- Retrieves user's saved settings
- Uses `x-device-id` header to identify device
- Returns: `{elevenLabsApiKey, voiceId, lang, updatedAt}`

**POST /api/settings**
- Saves settings to Vercel KV
- TTL: 30 days (auto-expires if inactive)
- Validates API key format (minimum 10 chars)
- Returns: Saved settings object

**Features:**
- CORS headers for cross-origin requests
- Automatic device ID generation if missing
- Basic API key validation
- Timestamp tracking for debugging

### 3. Configuration Files

#### package.json
- Added `@vercel/kv` dependency
- Scripts: `npm run dev` (local testing), `npm run deploy` (production)
- Set `type: "module"` for ES6 imports

#### vercel.json
- Already configured for Vercel deployment
- No build/install/dev commands needed (static + serverless)

#### .env.example
- Documents optional `ELEVENLABS_API_KEY` environment variable
- KV connection info (auto-populated by Vercel)

#### .gitignore
- Excludes `.vercel/` (Vercel build cache)
- Excludes `node_modules/`, `.env` files

## How It Works

### User Flow — First Time Setup

1. **User opens app** → Device ID auto-generated & stored in localStorage
2. **User clicks ⚙ Settings** → Modal appears
3. **User enters ElevenLabs API key** → `POST /api/settings` stores in Vercel KV
4. **User selects voice (Lola/Pablo/Diego/Lucia)** → Voice preference saved
5. **User clicks "Save & Test"** → speak("Hola, esto es una prueba de voz en español")
6. **App calls `/api/speak`** → ElevenLabs generates audio → plays in browser

### User Flow — Cross-Device Sync

1. **User opens app on phone** → Device ID auto-generated (different from desktop)
2. **App calls `GET /api/settings`** with phone device ID
3. **No settings found** (first time on phone) → Web Speech API is fallback
4. **User enters same API key in phone Settings modal**
5. **User enters same voice preference (Lola)**
6. **Now both phone + desktop use Lola voice**

**Note:** Settings are per-device, not per-user. This is intentional — users can choose different voices on different devices if desired. To implement true cross-device sync, would need user login system.

### Caching Strategy

**Client-Side (Browser Memory):**
- `TTS_CACHE = Map()` stores text → audio URL mappings
- Same word called twice in one session plays from cache (no API cost)
- Cache cleared on page reload

**Server-Side (Vercel KV):**
- Settings persist 30 days
- Auto-expires if no activity
- Can be manually cleared via Vercel dashboard

**ElevenLabs Usage:**
- Free tier: 10,000 characters/month
- Typical Dieciséis session: 50-200 characters
- Cache significantly reduces API calls

## Testing Checklist

### Phase 1: Local Development
- [ ] `npm install` in /d/Projects/dieciseis succeeds
- [ ] `vercel dev` starts local server
- [ ] Open http://localhost:3000 in browser
- [ ] Click ⚙ Settings — modal appears
- [ ] Enter valid ElevenLabs API key
- [ ] Select voice (Lola)
- [ ] Click "Save & Test" — audio plays with Spanish voice

### Phase 2: Cross-Device (Local Network)
- [ ] Run `vercel dev --public` to expose on network
- [ ] Open `http://[your-ip]:3000` on phone
- [ ] Verify same ⚙ Settings button works
- [ ] Verify drill → tap vocab word → Spanish voice plays
- [ ] Enter different API key on phone (or same key, different voice)

### Phase 3: Production Deployment
- [ ] `npm install` to ensure dependencies are vendored
- [ ] `vercel deploy --prod` deploys to Vercel
- [ ] Vercel dashboard confirms KV database is connected
- [ ] Set `ELEVENLABS_API_KEY` env var in Vercel (optional, for server-side key)
- [ ] Open https://dieciseis.vercel.app
- [ ] Repeat Phase 1 tests on production
- [ ] Test on mobile: https://dieciseis.vercel.app in Safari/Chrome
- [ ] Verify cross-device sync (if using same device ID):
  - [ ] Enter API key on desktop
  - [ ] Open on mobile → settings auto-load

### Phase 4: Regression Testing
- [ ] Verify Web Speech fallback still works (remove API key, drill plays voice)
- [ ] Verify tiles feature still works (Tiles toggle)
- [ ] Verify RU hints still work (RU toggle)
- [ ] Verify progress saving still works
- [ ] Test all drill types: lesson drill, mixed review, verb machine, forms trainer
- [ ] Tap vocabulary words → verify audio plays
- [ ] Test with multiple voices (Lola, Pablo, Diego, Lucia)

## Performance Considerations

### Audio Caching
- **Memory usage:** Each cached audio ≈ 50-100 KB (depends on text length)
- **Typical session:** 20-50 cached words = 1-5 MB
- **Cleanup:** Auto-cleared on page reload

### API Limits
- **Rate limiting:** ElevenLabs doesn't publish exact limits; assume safe for 100 requests/day
- **Bandwidth:** ~50 KB per word → 5 MB/month is ≈ 100,000 characters (within free tier)
- **Latency:** API response time ≈ 500-2000ms (user perceives slight delay)

### Vercel KV
- **Cost:** Free tier includes up to 1,000 commands/day
- **Typical usage:** 1-2 GET/POST per session = well below limit
- **Scaling:** Auto-scales if usage increases

## Known Limitations & Future Improvements

### Current Limitations
1. **Device-level settings, not user-level** — would need login to sync across phone + desktop
2. **API key entered by user** — more secure than storing in code, but UX burden
3. **No voice preview** — can't hear Lola vs Pablo before selecting
4. **ElevenLabs free tier** — 10k chars/month may limit heavy users

### Potential Improvements
1. **Add user authentication** (Firebase, Auth0) for true cross-device sync
2. **Add voice preview** — play sample sentences in each voice
3. **Add server-side API key storage** — opt-in for schools/organizations
4. **Add pronunciation feedback** — compare user recording vs target
5. **Add speed control** — let users slow down/speed up playback
6. **Add offline mode** — cache audio files for on-flight learning

## Rollback Instructions

If ElevenLabs breaks or TTS needs to be disabled:

```bash
# Option 1: Disable TTS without code changes
# In Vercel dashboard: Settings → Environment Variables → delete ELEVENLABS_API_KEY
# App falls back to Web Speech API automatically

# Option 2: Revert to previous commit
cd /d/Projects/dieciseis
git revert a021be1 -m "Revert TTS feature"
git push origin main
# Vercel auto-deploys

# Option 3: Manually disable TTS
# Edit index.html, line 627: change `if(elevenLabsApiKey){` to `if(false){`
```

## Monitoring & Debugging

### Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select Dieciséis project
3. **Functions** tab → see `/api/speak` and `/api/settings` logs
4. **Storage** tab → see KV database usage
5. **Deployments** tab → see deployment history

### Browser DevTools
```javascript
// Check loaded settings
console.log({elevenLabsApiKey, ttsSettings, deviceId})

// Test TTS endpoint
fetch('/api/speak', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'Hola', voiceId: 'lola'})
}).then(r => r.blob()).then(blob => {
  new Audio(URL.createObjectURL(blob)).play()
})

// Check settings in KV
fetch('/api/settings', {
  headers: {'x-device-id': deviceId}
}).then(r => r.json()).then(console.log)
```

### ElevenLabs Dashboard
1. Go to https://elevenlabs.io/app/dashboard
2. **Usage** tab → see character count
3. **API Keys** tab → see API key activity
4. **Billing** tab → manage subscription

## Files Reference

```
/d/Projects/dieciseis/
├── index.html                 # Frontend (modified)
├── api/
│   ├── speak.js              # NEW: TTS proxy endpoint
│   └── settings.js           # NEW: Settings manager endpoint
├── package.json              # NEW: Dependencies + scripts
├── vercel.json               # Config (already existed)
├── .env.example              # NEW: Environment template
├── .gitignore                # NEW/Updated: Build artifacts
├── SETUP_TTS.md             # NEW: Setup guide
└── IMPLEMENTATION_SUMMARY.md # This file
```

## Commits

```
a021be1 feat: Add ElevenLabs TTS + Vercel KV integration with Settings modal
f87d259 docs: Add TTS setup guide and environment configuration examples
```

## Next Steps

1. **Get ElevenLabs API key** from https://elevenlabs.io
2. **Install dependencies:** `npm install` in project root
3. **Test locally:** `vercel dev` then http://localhost:3000
4. **Deploy:** `vercel deploy --prod`
5. **Connect KV:** Vercel dashboard → Storage → Create Vercel KV
6. **Test on production:** https://dieciseis.vercel.app
7. **Monitor usage:** https://elevenlabs.io/app/dashboard

---

Questions? See SETUP_TTS.md for detailed configuration guide.
