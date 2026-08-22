# Dieciséis v1.0 — Locked

**Live:** https://dieciseis.vercel.app
**Repo:** https://github.com/ohmyseas/dieciseis
**Owner:** Ilya (kraim13@gmail.com)
**Status:** ✅ **v1.0 RELEASED & LOCKED** (2026-08-22)

The Spanish pilot is complete. A separate Portuguese app (`dezasseis`) will be built in a new chat as a standalone project — no merging back.

## What v1.0 delivers

Single-file HTML/CSS/JS app + one Vercel serverless function. No build step. localStorage-only persistence. Deploys to Vercel from GitHub main on push.

### 12 tools organized in 5 sections
```
📚 Study      — 16-lesson intensive (past tense by lesson 3)
🎯 Practice   — Verb Machine · 7-Forms Trainer · Mixed Review
🧠 Grammar    — Grammar Glue · Por vs Para · Subjunctive · False Friends
📖 Reference  — Numbers · Time & Dates · Essential Phrases
🎭 Culture    — Slang (España) · Cultural Memes
```

### By the numbers
| Content | Count |
|---|---|
| Full lessons with drills + quiz | 16 |
| Verbs (top ~95% frequency coverage) | 182 |
| Tenses per verb | 6 (Presente, Pretérito, Imperfecto, Futuro, Condicional, Subjuntivo) |
| Total conjugated forms | 6,552 (182 × 6 tenses × 6 pronouns) |
| 7-Forms Trainer scenarios | 32 |
| Grammar Glue items | 108 in 7 categories |
| Por vs Para examples | 30+ side-by-side |
| Subjunctive triggers/rules | 55 items in 8 categories |
| False Friends traps | 24 |
| Essential Phrases | 87 in 7 situations |
| España Slang | 59 in 4 registers |
| Cultural Memes / Refranes | 38 |
| Time expressions | 55 items |
| Numbers | ∞ (any 0-999,999 → Spanish text + speak) |
| **Total speakable Spanish items** | **~600+** (every tile in every tool speaks) |

### Architecture highlights
- **Auto-derivation**: Conditional and Subjunctive computed at load from base data
  - Conditional stem = Future stem (endings swap)
  - Subjunctive stem = yo-present indicative minus `-o` + opposite-family endings
  - Preserves 40+ irregular stems automatically (`tengo→tenga`, `hago→haga`, `digo→diga`)
  - 7 fully-irregular subjunctives are hard-overridden (ser, estar, ir, haber, saber, dar, ver)
- **Categorized Verb Machine**: 13 categories, searchable by Spanish or English
- **TTS**: ElevenLabs `eleven_multilingual_v2` model with auto-fallback voice
- **Bilingual everywhere**: English translation next to every Spanish item; tap to hear

### TTS setup for user
- Voice hardcoded to `GB7fZx4ubHWxbBE05abF` (Kravtsov, added to Ilya's library)
- Auto-fallback to Sarah (`EXAVITQu4vr4xnSDxMaL`) if custom voice unavailable
- User pastes their ElevenLabs API key once via the 🔊 chip → Audio Setup panel
- Diagnostic panel shows key status, tests, error details

## Files
| File | Role |
|---|---|
| `index.html` | Entire app (~2,500 lines, HTML + CSS + JS) |
| `api/speak.js` | Vercel serverless proxy to ElevenLabs |
| `vercel.json` | Vercel config (minimal) |
| `package.json` | Declares `type:module` for Vercel function |
| `HANDOFF.md` | This document |
| `README.md` | Public-facing description |

## Data locations in index.html
| Line ~ | What |
|---|---|
| 148-1032 | VERBS (147 hand-curated base verbs × 4 tenses each) |
| 1030-1034 | TENSE_NAMES / TENSE_EN / TENSE_EN_SHORT |
| 1153-1375 | LESSONS (16 lessons with notes, tables, vocab, drills, quiz) |
| 1377-1439 | FORMS_SCENARIOS (32) + FORM_TENSES (7-Forms Trainer) |
| 1500-1720 | GLUE_DATA + POR_PARA_DATA + FALSE_FRIENDS_DATA + SUBJ_DATA |
| 1750-1900 | Reference tools data (NUMBERS_LANDMARKS, TIME_DATA, PHRASES_DATA, SLANG_DATA, CULTURAL_DATA) |
| 2393-2498 | VERB_META (English + category for 147 base verbs) |
| 2500-2618 | Three verb-augmentation IIFEs (add 35 verbs, derive Conditional, derive Subjunctive) |
| 2620-onward | Render functions, drill engine, quiz, verb machine, all tools, boot |

## Commit history (all v1.0 work)
```
266b461 Fix: move verb-augmentation IIFEs to run AFTER VERB_META
e797143 Add 35 verbs (147→182) + Present Subjunctive + False Friends + Subjunctive reference
5c12e0c Grammar Glue + Por vs Para + home page reorganized into 5 sections
62c0158 Add 5 new reference tools + speakable pedagogical highlights
7ebcd87 Add 🔊 speaker buttons to every Spanish surface
8f684e4 WRAP: v2 release ready + key validation warnings
f417c4a TTS: multilingual_v2 + auto-fallback voice
e8254be Replace TTS prompt with diagnostic Audio Setup panel
1172d5f Round 1 fix: update Verb Machine description
1648478 Add 5th tense: Conditional (derived from Future)
a828dad Rebuild: clean TTS + searchable categorized Verb Machine
ba8cb0d CRITICAL FIX: Tense name mismatch broke lesson rendering
```

## What v1.0 explicitly does NOT include
Documented so future work doesn't rediscover these gaps:

- **Speech recognition** (say a word, app checks your pronunciation)
- **Spaced Repetition System** (proper SRS with due-date scheduling; current Mixed Review is weakness-weighted only)
- **Reading practice** (short bilingual passages — moved to a separate future app per Ilya's decision)
- **Listening comprehension** (hear-first-then-choose flow; current app is see-first-then-hear)
- **Writing practice** (type answers, check spelling + accents)
- **Adaptive difficulty**
- **Social features** (leaderboards, native corrections, community)
- **Nouns dictionary** (Ilya said he'll learn nouns organically)
- **German** (would need architecture rewrite for cases — out of scope; if built, use separate app)

## Portuguese port (next project, separate app)

Decision: **NOT a switcher in this app**. Portuguese will be its own app:
- Repo: `dezasseis` (Portuguese for 16)
- pt-PT specifically (European Portuguese, not Brazilian) — Ilya trip is to Portugal
- Different voice, different data, different cultural section
- Copy the architecture verbatim; swap the data

To be started in a new chat.

## Trip context
- **Sept 2, 2026** — Ilya flies to Spain for 10 days
- **Mid-September** — moves to Portugal for 4 weeks
- Dieciséis is the daily driver until landing in Lisbon; Dezasseis takes over then

## For the next agent (whoever picks this up)
1. Read this doc. Everything is here.
2. The 35 new verbs from the last update use a small `conjRegular()` helper — check it before adding more verbs (handles -car/-gar/-zar spelling changes automatically).
3. The subjunctive derivation is at the bottom of the augmentation section. It handles ~40 irregular stems automatically via the yo-drop trick. Only 7 verbs need hard overrides.
4. Do NOT change: voice ID, lesson content, verb data structure, localStorage keys (`dieciseis:v2`, `dieciseis:ttsKey`).
5. Every commit auto-deploys to Vercel. There is no staging.

**v1.0 is done.**
