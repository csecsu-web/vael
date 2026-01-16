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
    const { date, energyDirection, moment, pressureSource, bodyState } = JSON.parse(event.body);

    if (!date || !energyDirection || !moment) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Date, energy direction, and moment are required' })
      };
    }

    const store = getStore('reflection-entries');
    const key = `${user.userId}:daily:${date}`;

    const entry = {
      date,
      energyDirection,
      moment,
      pressureSource: pressureSource || null,
      bodyState: bodyState || null,
      createdAt: new Date().toISOString()
    };

    await store.set(key, encrypt(JSON.stringify(entry)));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to save entry' })
    };
  }
};
