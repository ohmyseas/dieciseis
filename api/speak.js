// Vercel API route for ElevenLabs TTS proxy
// Receives: {text, voiceId, lang}
// Returns: {audioUrl, success, error} or audio stream

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId = 'lola', lang = 'es-ES' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    // Try to get API key from Vercel KV (server-side storage)
    // Note: User can also pass it in request, but we prefer KV
    let apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      // No server-side API key configured
      return res.status(401).json({
        error: 'ElevenLabs API key not configured',
        fallbackToWebSpeech: true
      });
    }

    // Call ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs error:', error);
      return res.status(response.status).json({
        error: 'ElevenLabs API error',
        fallbackToWebSpeech: true,
        details: error
      });
    }

    // Stream the audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('TTS proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      fallbackToWebSpeech: true,
      message: error.message
    });
  }
}
