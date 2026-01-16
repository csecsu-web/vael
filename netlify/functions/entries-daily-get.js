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
    const date = event.path.split('/').pop();

    const store = getStore('reflection-entries');
    const key = `${user.userId}:daily:${date}`;

    const encryptedEntry = await store.get(key);
    
    if (!encryptedEntry) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(null)
      };
    }

    const entry = JSON.parse(decrypt(encryptedEntry));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        energy_direction: entry.energyDirection,
        moment: entry.moment,
        pressure_source: entry.pressureSource,
        body_state: entry.bodyState,
        date: entry.date
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to fetch entry' })
    };
  }
};
