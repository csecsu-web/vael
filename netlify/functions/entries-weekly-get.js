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
    const week = event.path.split('/').pop();

    const store = getStore('reflection-entries');
    const key = `${user.userId}:weekly:${week}`;

    const encryptedReflection = await store.get(key);
    
    if (!encryptedReflection) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(null)
      };
    }

    const reflection = JSON.parse(decrypt(encryptedReflection));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(reflection)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to fetch reflection' })
    };
  }
};
