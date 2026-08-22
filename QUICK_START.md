# Quick Start: ElevenLabs TTS for Dieciséis

## 30-Second Setup

1. **Get free ElevenLabs API key** (2 min)
   - Go to https://elevenlabs.io → Sign up
   - Account → API Keys → Copy key (looks like `sk-...`)

2. **Test locally** (5 min)
   ```bash
   cd /d/Projects/dieciseis
   npm install
   vercel dev
   # Open http://localhost:3000
   ```

3. **Configure voice in app** (1 min)
   - Click ⚙ (Settings) in top right
   - Paste API key
   - Select voice (Lola = Spain accent, best for learning)
   - Click "Save & Test"
   - Hear Spanish voice playing

4. **Deploy to production** (3 min)
   ```bash
   vercel deploy --prod
   # Follow prompts to connect Vercel KV storage
   ```

5. **Use on phone** (1 min)
   - Open https://dieciseis.vercel.app on phone
   - Click Settings ⚙
   - Enter same API key (or different voice if you prefer)
   - Tap vocabulary words in drills → hear Spanish voice

## What Just Happened?

- Your API key is stored securely in Vercel KV (server, not browser)
- Each device gets its own settings (phone vs desktop)
- Audio is cached locally (same word doesn't call API twice)
- Falls back to system voice if ElevenLabs fails

## Voice Choices

| Voice | Accent | Gender | Best For |
|-------|--------|--------|----------|
| **Lola** | Spain Spanish | Female | Recommended for learning |
| Pablo | Spain Spanish | Male | Alternative Spain voice |
| Diego | Latin American | Male | Alternative LA accent |
| Lucia | Latin American | Female | Alternative LA voice |

## Troubleshooting

### "No audio playing"
1. Check Settings ⚙ → API key is there
2. Check browser console (F12) for errors
3. Try fallback: Remove API key → Web Speech API should work

### "Settings not syncing to phone"
- Each device has its own device ID (by design)
- Re-enter API key on phone manually (takes 30 seconds)
- Or: Add environment variable `ELEVENLABS_API_KEY` to Vercel (then syncs automatically)

### "API key rejected"
- Verify key starts with `sk-`
- Check https://elevenlabs.io/app/account for validity
- Regenerate key if expired

### "Free tier limit hit"
- Free tier: 10,000 characters/month (~100-200 vocab words)
- Cache means most words only count once
- Upgrade to paid plan if needed ($5-15/month for casual use)

## Costs

- **Free tier:** 10k chars/month = $0
- **Typical use:** 50-100 vocab words = 2-5k chars = well within free
- **Upgrade:** Only needed if drilling 200+ vocabulary daily

## File Changes Summary

| File | What Changed |
|------|--------------|
| `index.html` | Added Settings modal, updated speak() function |
| `api/speak.js` | NEW: TTS proxy endpoint |
| `api/settings.js` | NEW: Settings storage (Vercel KV) |
| `package.json` | NEW: Added @vercel/kv dependency |

## What Doesn't Change

- All existing features (tiles, RU hints, progress tracking, all drills)
- Web Speech fallback if ElevenLabs unavailable
- No login required (device-based settings)

## Full Documentation

- **Setup Guide:** See [SETUP_TTS.md](SETUP_TTS.md)
- **Implementation Details:** See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **ElevenLabs Docs:** https://elevenlabs.io/docs

## Next: Add to Your Workflow

### Drill with Spanish voice
1. Open lesson → Drill tab
2. Read Spanish vocab (click word) → hear Lola speaking
3. Answers also speak (with Spanish accent)

### Monitor costs
1. Weekly: Check https://elevenlabs.io/app/dashboard
2. Once character count > 8k/month, consider upgrade
3. Upgrade page: https://elevenlabs.io/app/billing/plans

### Optional: Set server-side API key
If you want settings to auto-sync across phone + desktop:
1. Vercel dashboard → Settings → Environment Variables
2. Add `ELEVENLABS_API_KEY=sk-your-key`
3. Re-deploy: `vercel deploy --prod`
4. Now phone & desktop both use Lola without re-entering key

---

**Done!** Start learning Spanish with professional TTS. 🎙️
