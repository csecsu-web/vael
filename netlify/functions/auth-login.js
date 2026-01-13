const { getStore } = require('@netlify/blobs');
const bcrypt = require('bcryptjs');
const { createToken, decrypt, corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    const store = getStore('reflection-users');
    const normalizedEmail = email.toLowerCase();

    const encryptedUser = await store.get(normalizedEmail);
    if (!encryptedUser) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    const userData = JSON.parse(decrypt(encryptedUser));
    const validPassword = await bcrypt.compare(password, userData.passwordHash);

    if (!validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    const token = createToken(userData.id, userData.email);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
      },
      body: JSON.stringify({ userId: userData.id, email: userData.email })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Login failed' })
    };
  }
};
