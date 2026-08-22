// Vercel API route for managing user settings (API keys, preferences)
// GET /api/settings - retrieve settings
// POST /api/settings - save settings

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple session/device ID from client (using IP + user agent as identifier)
  const deviceId = req.headers['x-device-id'] || `device-${Date.now()}`;

  if (req.method === 'GET') {
    try {
      // Retrieve settings from Vercel KV
      const settings = await kv.get(`dieciseis:settings:${deviceId}`);

      return res.status(200).json({
        success: true,
        settings: settings || {
          elevenLabsApiKey: null,
          voiceId: 'lola',
          lang: 'es-ES'
        }
      });
    } catch (error) {
      console.error('Settings GET error:', error);
      return res.status(500).json({
        error: 'Failed to retrieve settings',
        message: error.message
      });
    }
  }

  if (req.method === 'POST') {
    const { elevenLabsApiKey, voiceId, lang } = req.body;

    try {
      // Validate API key format (basic check)
      if (elevenLabsApiKey && elevenLabsApiKey.length < 10) {
        return res.status(400).json({
          error: 'Invalid API key format'
        });
      }

      // Save settings to Vercel KV
      // TTL: 30 days (2592000 seconds)
      const settings = {
        elevenLabsApiKey: elevenLabsApiKey || null,
        voiceId: voiceId || 'lola',
        lang: lang || 'es-ES',
        updatedAt: new Date().toISOString()
      };

      await kv.setex(
        `dieciseis:settings:${deviceId}`,
        2592000,
        JSON.stringify(settings)
      );

      return res.status(200).json({
        success: true,
        settings: settings
      });
    } catch (error) {
      console.error('Settings POST error:', error);
      return res.status(500).json({
        error: 'Failed to save settings',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
