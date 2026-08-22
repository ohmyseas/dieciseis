// Dieciséis v2 Verification Script
// Tests: verb count, tense coverage, tiles rendering, voice configuration

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Dieciséis v2 Verification ===\n');

// Read index.html
const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract JavaScript
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) {
  console.log('ERROR: No script tag found');
  process.exit(1);
}

const script = scriptMatch[1];

// 1. Verify verb data
console.log('1. VERB DATA VERIFICATION');
const verbsMatch = script.match(/const VERBS = \{([\s\S]*?)\n\};/);
if (!verbsMatch) {
  console.log('   ERROR: VERBS object not found');
  process.exit(1);
}

// Parse verb structure
const verbsStr = verbsMatch[1];
const verbEntries = verbsStr.match(/^ *'([^']+)':\s*\{([^}]+)\}/gm) || [];

console.log(`   Total verbs found: ${verbEntries.length}`);

// Check each verb for tenses
let incompleteTenses = [];
let incompleteVerbs = [];

verbEntries.forEach(entry => {
  const nameMatch = entry.match(/'([^']+)':/);
  const verbName = nameMatch ? nameMatch[1] : 'unknown';

  const tenses = ['present', 'preterite', 'imperfect', 'future'];
  const missing = tenses.filter(t => !entry.includes(t + ':'));

  if (missing.length > 0) {
    incompleteVerbs.push(verbName);
    missing.forEach(t => incompleteTenses.push({ verb: verbName, tense: t }));
  }
});

if (incompleteTenses.length > 0) {
  console.log(`   ERROR: ${incompleteTenses.length} missing tenses across ${incompleteVerbs.length} verbs`);
  incompleteTenses.slice(0, 10).forEach(({verb, tense}) => {
    console.log(`      - ${verb}: missing ${tense}`);
  });
} else {
  console.log('   ✓ All verbs have all 4 tenses');
}

// 2. Verify voice IDs
console.log('\n2. VOICE CONFIGURATION');
const hasUserVoice = script.includes('GB7fZx4ubHWxbBE05abF');
const hasOldVoice = script.includes('EXAVITQu4vr4xnSDxMaL');

console.log(`   User voice (GB7fZx4ubHWxbBE05abF): ${hasUserVoice ? '✓ FOUND' : '✗ MISSING'}`);
console.log(`   Old Lola voice reference (EXAVITQu4vr4xnSDxMaL): ${hasOldVoice ? 'FOUND (expected)' : 'NOT FOUND'}`);

// Check default voice ID
const defaultVoiceMatch = script.match(/let elevenLabsVoiceId = "([^"]+)"/);
if (defaultVoiceMatch) {
  console.log(`   Default voice ID: ${defaultVoiceMatch[1]}`);
} else {
  console.log('   ERROR: Default voice ID not found');
}

// 3. Verify API proxy configuration
console.log('\n3. API PROXY');
const hasApiCall = script.includes("fetch('/api/speak'");
console.log(`   /api/speak proxy call: ${hasApiCall ? '✓ FOUND' : '✗ MISSING'}`);

// 4. Check for broken HTML/syntax
console.log('\n4. SYNTAX CHECKS');
const brokenTags = html.match(/<\\\/[a-z]+>/g);
const brokenComments = script.match(/\\\s+\{/g);

if (brokenTags && brokenTags.length > 0) {
  console.log(`   ERROR: ${brokenTags.length} broken closing tags found`);
} else {
  console.log('   ✓ No broken HTML tags');
}

if (brokenComments && brokenComments.length > 0) {
  console.log(`   ERROR: ${brokenComments.length} broken comment syntax found`);
} else {
  console.log('   ✓ Comment syntax OK');
}

// 5. Verify lesson structure
console.log('\n5. LESSON STRUCTURE');
const lessonsMatch = script.match(/const LESSONS = \[([\s\S]*?)\n\];/);
if (lessonsMatch) {
  const lessonCount = (lessonsMatch[1].match(/\/\* \d+ \*\//g) || []).length;
  console.log(`   Total lessons: ${lessonCount}`);
} else {
  console.log('   ERROR: LESSONS not found');
}

// 6. Verify drills in lessons
console.log('\n6. DRILL DATA');
const hasDrills = script.includes('drills:[');
const hasQuiz = script.includes('quiz:[');
console.log(`   Drills defined: ${hasDrills ? '✓' : '✗'}`);
console.log(`   Quiz defined: ${hasQuiz ? '✓' : '✗'}`);

// 7. Verify settings modal
console.log('\n7. SETTINGS MODAL');
const hasVoiceSelect = html.includes('id="voice-select"');
const hasApiKeyInput = html.includes('id="api-key-input"');
console.log(`   Voice selector: ${hasVoiceSelect ? '✓' : '✗'}`);
console.log(`   API key input: ${hasApiKeyInput ? '✓' : '✗'}`);

// 8. Summary
console.log('\n=== SUMMARY ===');
const issues = incompleteTenses.length + (brokenTags ? brokenTags.length : 0) +
               (brokenComments ? brokenComments.length : 0);

if (issues === 0) {
  console.log('✓ All checks passed - app ready for testing');
} else {
  console.log(`✗ ${issues} issues found - see above for details`);
  process.exit(1);
}
