# Dieciséis v2 — Handoff

**Live:** https://dieciseis.vercel.app
**Repo:** https://github.com/ohmyseas/dieciseis
**Owner:** Ilya (kraim13@gmail.com)
**Status:** Feature-complete except for one blocker (see below)

## What this is
Single-file Spanish learning app (no build step, no backend of its own beyond one Vercel serverless function). Deployed to Vercel from GitHub main branch — every git push auto-deploys.

## Architecture
- **`index.html`** — the entire app (~2,300 lines). HTML + CSS + JS in one file.
- **`api/speak.js`** — Vercel serverless function proxying ElevenLabs TTS (avoids CORS + hides which voice is fallback).
- **`vercel.json`** — trivial config.
- **`package.json`** — declares `type: module` for the Vercel function.
- **State:** everything persisted in `localStorage` — no database.

## Feature list (all working)
1. **16 lessons** — original curriculum, past tense by lesson 3, tiles for sentence assembly, quiz gate at 75%.
2. **147 Spanish verbs** — 5 tenses each: Presente / Pretérito / Imperfecto / Futuro / Condicional.
3. **Verb Machine** — searchable (English or Spanish) + filterable by 13 categories (essentials, communication, movement, food, daily, work, mind, money, life, actions, perception, creative, weather).
4. **7-Forms Trainer** — 32 scenario cards drilling tense-selection across pret / imp / perf / ifut / sfut / cond / plup.
5. **Mixed Review** — weakness-weighted deck from previously-opened lessons.
6. **Audio Setup panel** — full diagnostic UI (tap 🔊 in top bar) with test buttons and status readout.
7. **Verified via Playwright** — all 16 lessons open, tiles work, all 147 verbs have valid Conditional forms.

## Known blocker: TTS 401 Invalid API Key
User's ElevenLabs API key is being rejected by ElevenLabs (not by our code).

Repeat failing request produces:
```
HTTP 401
{"detail":{"type":"authentication_error","code":"unauthorized","message":"Invalid API key"}}
```

### What was already tried
- ✅ Proxy verified working with curl (returns proper 401 for bad keys, would return 200 + audio for valid keys).
- ✅ Model upgraded to `eleven_multilingual_v2` (was `eleven_monolingual_v1` — wrong for Spanish).
- ✅ Auto-fallback to Sarah voice (`EXAVITQu4vr4xnSDxMaL`) if custom voice isn't in the user's library.
- ✅ Voice ID `GB7fZx4ubHWxbBE05abF` confirmed correct.
- ✅ User rotated key and made it unrestricted — still 401.
- ✅ Diagnostic panel shows first 14 + last 6 chars of the key and warns if it doesn't start with `sk_`.

### Most likely cause
User is pasting the **Key ID** (short label like `xi-...`) instead of the **actual API secret** (long string starting with `sk_`, ~50 chars).

On the ElevenLabs API keys page (`https://elevenlabs.io/app/settings/api-keys`), the secret is only visible when you click "Show" or the eye icon — or immediately after creating a new key. The Key ID is what's shown by default.

### Next diagnostic step for the next agent
1. Have the user open the Audio Setup panel (tap 🔊 in the top bar).
2. After they paste their key, the panel shows: `Current key: sk_abc123def456...xyz789 (52 chars, starts with 'sk_')`.
3. If it doesn't start with `sk_`, the panel now shows a red warning explaining they pasted the wrong string.
4. If it DOES start with `sk_` and still 401 → the key was revoked, is from a different account, or has scoped restrictions blocking TTS.
5. Ultimate fallback: user could hardcode a working API key server-side using a Vercel env var (`ELEVEN_API_KEY`) — modify `api/speak.js` to use it if the client didn't send one. Not currently implemented.

## Key files to know
- `index.html:148-1032` — VERBS data (147 verbs × 4 base tenses)
- `index.html:1034-1054` — TENSE_NAMES, TENSE_EN, TENSE_EN_SHORT, Conditional derivation IIFE
- `index.html:~1445-1610` — TTS speak() + Audio Setup panel + testCurrentKey()
- `index.html:~1830-1990` — VERB_META (English + category for all 147 verbs)
- `index.html:~1990-2090` — Verb Machine (renderVMList, renderVMTable, filters, search)
- `api/speak.js` — proxy with multilingual model + auto-fallback voice

## Commit history (recent, chronological)
```
f417c4a TTS: multilingual_v2 + auto-fallback to Sarah voice
e8254be Replace TTS prompt with full diagnostic Audio Setup panel
1172d5f Round 1 fix: update Verb Machine description on home screen
1648478 Add 5th tense: Conditional (derived from Future stems)
a828dad Rebuild: clean TTS + searchable categorized Verb Machine
ba8cb0d CRITICAL FIX: Tense name mismatch broke lesson rendering
```

## What NOT to change without asking Ilya
- **Voice ID `GB7fZx4ubHWxbBE05abF`** — this is Ilya's shared voice on ElevenLabs.
- **The 16-lesson structure** — original pedagogical content.
- **Verb data (147 verbs, all 5 tenses)** — hand-curated from Ilya's spreadsheet.
- **localStorage keys** (`dieciseis:v2`, `dieciseis:ttsKey`) — changing them wipes user progress.

## Trip context
Ilya travels to Spain Sept 2 (10 days from build), then Portugal mid-September for 4 weeks. This app is the daily driver. Portuguese variant is planned but out of scope for this build.
