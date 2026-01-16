const { getStore } = require('@netlify/blobs');
const { verifyToken, encrypt, corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const user = verifyToken(event.headers);
    const { weekKey, repeated, misaligned, stable, override, summary } = JSON.parse(event.body);

    if (!weekKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Week key is required' })
      };
    }

    const store = getStore('reflection-entries');
    const key = `${user.userId}:weekly:${weekKey}`;

    const reflection = {
      weekKey,
      repeated: repeated || '',
      misaligned: misaligned || '',
      stable: stable || '',
      override: override || '',
      summary: summary || '',
      createdAt: new Date().toISOString()
    };

    await store.set(key, encrypt(JSON.stringify(reflection)));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to save reflection' })
    };
  }
};
