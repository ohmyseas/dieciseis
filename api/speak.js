// Vercel API route for ElevenLabs TTS proxy
// Receives: {text, apiKey, voiceId}
// Returns: audio/mpeg stream
//
// Strategy:
//  1. Try requested voiceId with multilingual v2 (works for any language incl. Spanish)
//  2. If 404/422 (voice not in user's library), automatically fall back to Sarah — a public
//     default voice available in every account — using multilingual v2 which speaks Spanish fluently
//  3. If any other error, return it verbatim

const FALLBACK_VOICE = 'EXAVITQu4vr4xnSDxMaL'; // Sarah — public, in every account

async function elevenlabsCall(voiceId, text, apiKey) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, apiKey, voiceId = 'GB7fZx4ubHWxbBE05abF' } = req.body;

  if (!text || !apiKey) {
    return res.status(400).json({ error: 'Missing text or apiKey' });
  }

  try {
    let response = await elevenlabsCall(voiceId, text, apiKey);
    let usedFallback = false;

    // Fallback if voice isn't in this user's library
    if ((response.status === 404 || response.status === 422) && voiceId !== FALLBACK_VOICE) {
      const errBody = await response.text();
      // Retry with the public Sarah voice + multilingual (still Spanish, different speaker)
      response = await elevenlabsCall(FALLBACK_VOICE, text, apiKey);
      usedFallback = true;
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `ElevenLabs API error (both voices failed): primary=${errBody.slice(0, 200)} | fallback=${errorText.slice(0, 200)}`,
        });
      }
    } else if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${errorText}`,
      });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (usedFallback) res.setHeader('X-Voice-Fallback', 'true');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
