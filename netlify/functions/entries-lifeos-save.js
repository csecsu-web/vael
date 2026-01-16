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
    const { refuse, badAt, slowDown } = JSON.parse(event.body);

    const store = getStore('reflection-entries');
    const key = `${user.userId}:lifeos`;

    const lifeos = {
      refuse: refuse || ['', '', ''],
      badAt: badAt || ['', '', ''],
      slowDown: slowDown || ['', '', ''],
      updatedAt: new Date().toISOString()
    };

    await store.set(key, encrypt(JSON.stringify(lifeos)));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to save LifeOS' })
    };
  }
};
