const { getStore } = require('@netlify/blobs');
const { verifyToken, decrypt, corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const user = verifyToken(event.headers);
    // Extract month from path like /api/entries/monthly/2026-01/entries
    const pathParts = event.path.split('/');
    const month = pathParts[pathParts.length - 2];

    const store = getStore('reflection-entries');
    const prefix = `${user.userId}:daily:${month}`;

    const { blobs } = await store.list({ prefix });
    const entries = [];

    for (const blob of blobs) {
      try {
        const encryptedEntry = await store.get(blob.key);
        if (encryptedEntry) {
          const entry = JSON.parse(decrypt(encryptedEntry));
          entries.push({
            id: blob.key,
            date: entry.date,
            moment: entry.moment,
            energy_direction: entry.energyDirection,
            pressure_source: entry.pressureSource,
            body_state: entry.bodyState
          });
        }
      } catch (err) {
        console.error('Error decrypting entry:', err);
        // Skip invalid entries
      }
    }

    // Sort by date ascending
    entries.sort((a, b) => a.date.localeCompare(b.date));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(entries)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to fetch entries' })
    };
  }
};
