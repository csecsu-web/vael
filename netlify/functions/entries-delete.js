const { getStore } = require('@netlify/blobs');
const { verifyToken, corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const user = verifyToken(event.headers);
    const entriesStore = getStore('reflection-entries');
    const usersStore = getStore('reflection-users');

    // Delete all entries for this user
    const { blobs } = await entriesStore.list({ prefix: user.userId });
    
    for (const blob of blobs) {
      await entriesStore.delete(blob.key);
    }

    // Delete user account
    await usersStore.delete(user.email);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Set-Cookie': 'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to delete account' })
    };
  }
};
