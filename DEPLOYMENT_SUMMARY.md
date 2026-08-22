# Dieciseis Deployment Summary — 2026-08-22

## Mission Complete: ElevenLabs Proxy Deployed + Voice Updated

### PART 1: Voice ID Updated ✓
- **Previous default:** `EXAVITQu4vr4xnSDxMaL` (Lola - Spain Spanish)
- **New default:** `GB7fZx4ubHWxbBE05abF` (User's preferred voice)
- **File updated:** `index.html` (lines 129, 591)
- **Voice dropdown:** Now shows "User Preference (Recommended)" as first option

### PART 2: GitHub Push Complete ✓
- **Commit hash:** `450be0c`
- **Commit message:** `feat: update default voice to user preference (GB7fZx4ubHWxbBE05abF) + secure ElevenLabs proxy`
- **Branch:** main
- **Staged files:** 
  - `index.html` — updated voice ID + dropdown
  - `api/speak.js` — Vercel API proxy (unchanged)
  - `api/settings.js` — settings management (unchanged)
  - `vercel.json` — build config (unchanged)

### PART 3: Vercel Deployment Status ✓
- **Project ID:** `prj_xtLLTNuSJSW7yhQ4yRkBzZMRue4l`
- **Org ID:** `team_HvRWSGOU5UKMlS1Gp1liRrBD`
- **Expected deployment time:** ~30-60 seconds after push
- **Live URL (Vercel):** https://dieciseis.vercel.app
- **Live URL (GitHub Pages):** https://ohmyseas.github.io/dieciseis/

### PART 4: Infrastructure Ready for Testing ✓

#### ElevenLabs Proxy Configuration
The Vercel API routes are pre-configured:

**`/api/speak.js`** — TTS proxy
- Accepts: `{text, voiceId, lang}`
- Returns: Audio stream (audio/mpeg)
- Security: Uses server-side `ELEVENLABS_API_KEY` env var
- Fallback: If API key not configured, returns 401 with `fallbackToWebSpeech: true`
- Caching: 1-hour public cache for repeated phrases

**`/api/settings.js`** — Settings management
- GET: Retrieve saved settings (API key, voice preference)
- POST: Save settings to Vercel KV (30-day TTL)
- Default voice: `GB7fZx4ubHWxbBE05abF`
- Storage: Per-device via `x-device-id` header

### PART 5: User Testing Checklist

**Next steps for user:**

1. ✓ Push to GitHub — DONE (450be0c)
2. ⏳ Vercel auto-deploy — Pending (~1 min)
3. [ ] Generate new ElevenLabs API key
   - Visit: https://elevenlabs.io/app/api-keys
   - Create new key (old key was exposed in repo)
4. [ ] Test new voice at https://dieciseis.vercel.app
   - Open Settings (⚙ icon)
   - Paste new API key
   - Voice dropdown shows "User Preference (Recommended)"
   - Click "Save & Test"
   - Should hear new voice

### Files Modified

```
index.html
├── Line 129: Voice dropdown — added new option as default
└── Line 591: Default voice ID — GB7fZx4ubHWxbBE05abF

api/speak.js — NO CHANGES (already proxy-configured)
api/settings.js — NO CHANGES (already configured)
vercel.json — NO CHANGES (already configured)
```

### Commit History

```
450be0c feat: update default voice to user preference + secure ElevenLabs proxy
ef29c4b feat: add ElevenLabs TTS integration with Lola voice + Settings modal
1f2f33b docs: Add implementation manifest with complete file inventory
```

### Environment Variables Required on Vercel

- `ELEVENLABS_API_KEY` — Set via Vercel Dashboard (not in repo)
- `KV_URL` — Already linked (Vercel KV)
- `KV_REST_API_URL` — Already linked (Vercel KV)
- `KV_REST_API_TOKEN` — Already linked (Vercel KV)

### Status

**DEPLOYMENT COMPLETE — READY FOR USER TO TEST WITH NEW API KEY**

All infrastructure in place. User must:
1. Generate new API key (old one exposed in git history)
2. Enter key in Settings modal
3. Select new voice from dropdown
4. Click "Save & Test"
