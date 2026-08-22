# Dieciséis v2 — Spanish Learning App

A 16-lesson intensive Spanish course with professional TTS voice synthesis, persistent progress tracking, and cross-device synchronization.

## Features

- **16 Lessons** — Verb algorithms, past tense, present perfect, future tense, conditionals, imperative, comparatives, navigation
- **Professional TTS** — ElevenLabs Spanish voice (Spain or Latin American accent)
- **Multiple Drill Types** — Sentence assembly, flashcards, multiple-choice quizzes
- **Persistent Progress** — Saves lesson completion and per-sentence scores
- **Cross-Device Sync** — Settings and progress via Vercel KV storage
- **Graceful Fallback** — Web Speech API if ElevenLabs unavailable
- **Offline Capable** — Works locally (TTS requires API key for ElevenLabs)

## Quick Start

1. **Get ElevenLabs API key** (free tier: 10k chars/month)
   ```bash
   # Sign up at https://elevenlabs.io
   # Go to Account → API Keys
   # Copy your API key (looks like sk-...)
   ```

2. **Install and run locally**
   ```bash
   cd /d/Projects/dieciseis
   npm install
   vercel dev
   # Open http://localhost:3000
   ```

3. **Configure TTS in app**
   - Click ⚙ (Settings) in top right
   - Enter ElevenLabs API key
   - Select voice (Lola recommended for Spain accent)
   - Click "Save & Test"

4. **Deploy to production**
   ```bash
   vercel deploy --prod
   # Vercel will prompt to create KV storage
   ```

## Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide |
| [SETUP_TTS.md](SETUP_TTS.md) | Detailed TTS configuration |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Architecture & testing checklist |

## Architecture

```
Frontend (index.html)
├── Settings Modal (⚙ button)
├── Updated speak() function
│   ├── Tries ElevenLabs API (if key available)
│   └── Falls back to Web Speech API
└── Device ID tracking (localStorage)

Backend (Vercel Serverless)
├── /api/speak.js
│   └── Proxies to ElevenLabs API
│       └── Streams audio response
└── /api/settings.js
    ├── GET: Retrieve stored settings
    └── POST: Save to Vercel KV

Storage (Vercel KV)
└── User settings (API key, voice preference)
    └── 30-day TTL per device
```

## Voice Options

| Voice | Accent | Gender |
|-------|--------|--------|
| Lola | Spain Spanish | Female |
| Pablo | Spain Spanish | Male |
| Diego | Latin American | Male |
| Lucia | Latin American | Female |

## Costs

- **Free tier:** 10,000 characters/month ($0)
- **Typical usage:** 50-200 characters per session
- **Paid plans:** $5-15/month for heavy use

## Directory Structure

```
/d/Projects/dieciseis/
├── index.html                 # Main app (modified)
├── api/
│   ├── speak.js              # ElevenLabs TTS proxy
│   └── settings.js           # Settings manager
├── package.json              # Dependencies
├── vercel.json               # Vercel config
├── .env.example              # Environment template
├── QUICK_START.md           # Quick setup guide
├── SETUP_TTS.md             # Detailed setup
├── IMPLEMENTATION_SUMMARY.md # Architecture docs
└── README.md                # This file
```

## Development

### Local Testing
```bash
npm install
vercel dev          # Start local server
# Open http://localhost:3000
```

### Production Deployment
```bash
vercel deploy --prod
# Vercel will create KV database
# Add ELEVENLABS_API_KEY env var (optional)
```

### Debugging

Browser console:
```javascript
// Check loaded settings
console.log({elevenLabsApiKey, ttsSettings, deviceId})

// Test TTS endpoint
fetch('/api/speak', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'Hola', voiceId: 'lola'})
}).then(r => r.blob()).then(blob => new Audio(URL.createObjectURL(blob)).play())
```

## Features & Drills

### Lesson Content
- Verb conjugation tables (presente, pretérito)
- Vocabulary with audio playback
- Sentence assembly drills (tiles)
- Multiple-choice quizzes (75% pass rate to complete)

### Tools
- **Verb Machine** — Drill 14 key verbs blindfolded
- **Mixed Review** — Resurfaced weak sentences from all lessons
- **7-Forms Trainer** — Master past & future tense decision tree

### Settings
- Toggle Russian hints (on/off)
- Toggle tiles mode (on/off)
- Configure ElevenLabs voice
- Monitor progress (16 lessons)

## Compatibility

- **Desktop:** Chrome, Firefox, Safari, Edge
- **Mobile:** iOS Safari, Android Chrome
- **Requirements:** Modern browser with WebAPI support

## Performance

- **Audio caching:** Same word only calls API once per session
- **Lazy loading:** Settings loaded on startup
- **Vercel KV:** Auto-scales with usage
- **Typical latency:** 500-2000ms per TTS request

## Troubleshooting

### No audio playing
1. Verify API key in Settings ⚙
2. Check browser console (F12) for errors
3. Try fallback: Remove API key to use Web Speech

### Settings not syncing
- Device-level settings (not user-level by design)
- Each device has own device ID
- To sync: Add `ELEVENLABS_API_KEY` env var to Vercel

### Free tier limit exceeded
- Check usage at https://elevenlabs.io/app/dashboard
- Cache reduces API calls significantly
- Upgrade plan if needed

## License

Private project. Contact for permissions.

## Related Projects

- **Frontend:** Vercel-deployed static + serverless
- **Backend:** Node.js ES6 API routes
- **Storage:** Vercel KV (Redis)
- **TTS:** ElevenLabs API v1

## Support

- **Setup issues:** See [SETUP_TTS.md](SETUP_TTS.md)
- **Technical details:** See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **ElevenLabs:** https://elevenlabs.io/docs
- **Vercel:** https://vercel.com/docs

---

Built with Vercel + ElevenLabs + Dieciséis pedagogy. Ship date: August 2026.
