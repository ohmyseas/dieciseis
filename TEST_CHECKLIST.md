# Dieciséis v2 - Testing Checklist

**Deployment:** https://dieciseis.vercel.app
**Date:** 2026-08-22
**Fixes Applied:**
- Voice dropdown: Removed old Lola voice (EXAVITQu4vr4xnSDxMaL)
- Voice migration: Old voice automatically converts to user's Spanish voice (GB7fZx4ubHWxbBE05abF)
- Verb data: 147 Spanish verbs with all 4 tenses (present, preterite, imperfect, future)
- HTML syntax: All tags properly closed, no broken comments

---

## CRITICAL PATH TEST (15 min)

### 1. Settings & Voice Configuration
- [ ] Open app at https://dieciseis.vercel.app
- [ ] Click "Settings" button (⚙️ icon if present, or cog in topbar)
- [ ] Enter your ElevenLabs API key (starts with `sk-`)
- [ ] Select voice: "Your Spanish Voice (Default)" should be selected
- [ ] Click "Save & Test"
- [ ] **CRITICAL:** Verify audio plays in SPANISH (not British English)
- [ ] Audio should say: "Hola. Soy Lola. Voy a ser tu voz en español."
- [ ] Close settings

### 2. Verb Machine (Conjugation Drill)
- [ ] Click "Verb Machine" tool (if available on home screen)
- [ ] OR: Go to Lesson 1 → Verb Machine tab
- [ ] Verify you see a verb selector/drill interface
- [ ] **COUNT:** Should show 147 verbs available (check dropdown if present)
- [ ] Select a verb (e.g., "hablar")
- [ ] **TENSES:** Verify all 4 tenses show:
  - [ ] Presente: hablo, hablas, habla, hablamos, habláis, hablan
  - [ ] Pretérito: hablé, hablaste, habló, hablamos, hablasteis, hablaron
  - [ ] Imperfecto: hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban
  - [ ] Futuro: hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán
- [ ] Test 3 more verbs to ensure all have all 4 tenses
- [ ] Test audio for 2 conjugations (should use your Spanish voice)

### 3. Tiles Functionality
- [ ] Go to Lesson 1
- [ ] Click "Start Lesson" → Drills
- [ ] Check the "Tiles" toggle in top bar - should be ON (highlighted)
- [ ] First drill should show:
  - [ ] English prompt (e.g., "I work.")
  - [ ] Empty answer zone at top with placeholder "tap tiles below..."
  - [ ] Tiles bank below with shuffled Spanish words
- [ ] **TEST TILE INTERACTION:**
  - [ ] Click/tap first tile → should move to answer zone
  - [ ] Click/tap tile in answer zone → should move back to bank
  - [ ] Build the correct sentence by tapping tiles in order
  - [ ] Click "Check" button
  - [ ] Should show green (correct) or ask to try again
- [ ] **TEST 3 DRILLS** to ensure tiles work consistently

### 4. Dialog Mode (should NOT have tiles)
- [ ] Continue through Lesson 1 drills until you hit a dialog (marked with `dlg`)
- [ ] Dialog example: "— A table for two, please. — Yes, this way."
- [ ] Verify tiles are NOT shown for dialogs (correct behavior)
- [ ] Verify you can still reveal and hear the Spanish

### 5. Quiz
- [ ] Complete Lesson 1 drills (or click "Take the check →")
- [ ] Go through Quiz questions
- [ ] **VERIFY:** All questions are in English with Spanish/Russian hints
- [ ] Verify you can select answers
- [ ] Check your score at the end

### 6. State Persistence
- [ ] Complete first 2 drills of Lesson 1
- [ ] Click home (⌂ icon or "Home" button)
- [ ] Go back to Lesson 1 → Drills
- [ ] **VERIFY:** You resume from drill 3 (not drill 1)
- [ ] Close browser tab
- [ ] Reopen https://dieciseis.vercel.app
- [ ] Go back to Lesson 1
- [ ] **VERIFY:** Progress is still there

---

## MOBILE TEST (if available)
- [ ] Test on iPhone/iPad or Android
- [ ] Verify layout is responsive
- [ ] Verify tiles are tap-able on mobile
- [ ] Verify audio playback works
- [ ] Check Settings modal fits on mobile screen

---

## CONSOLE ERROR CHECK (DevTools)
- [ ] Open browser Developer Tools (F12 or Cmd+Option+I)
- [ ] Go to Console tab
- [ ] Run through one complete lesson drill
- [ ] **VERIFY:** No red error messages in console
- [ ] Note any warnings and report if they're blocking

---

## PASS/FAIL CRITERIA

**PASS IF:**
- ✓ Voice plays in Spanish (not English/British)
- ✓ All 147 verbs show with all 4 tenses
- ✓ Tiles render and can be clicked/tapped
- ✓ Tiles move between answer zone and bank correctly
- ✓ Lessons complete end-to-end
- ✓ No critical console errors
- ✓ State persists after refresh

**FAIL IF:**
- ✗ Voice plays in British English
- ✗ Fewer than 147 verbs or missing tenses
- ✗ Tiles don't render or aren't clickable
- ✗ Tiles can't be moved to answer zone
- ✗ Console has red errors about undefined functions

---

## KNOWN LIMITATIONS
- 16 lessons (Spanish intensive course, Days 1-16)
- No 7-Forms Trainer yet (spaced tense-selection drills)
- No async backend (all data in browser)
- Audio quality depends on ElevenLabs API quality

---

## NEXT STEPS IF ISSUES FOUND
1. Screenshot the error/issue
2. Open browser console (F12) and copy console output
3. Note which step failed
4. Report with: browser, OS, lesson number, exact error
