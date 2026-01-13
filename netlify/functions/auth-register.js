const { getStore } = require('@netlify/blobs');
const bcrypt = require('bcryptjs');
const { createToken, encrypt, corsHeaders } = require('./utils');

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

    if (password.length < 8) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password must be at least 8 characters' })
      };
    }

    const store = getStore('reflection-users');
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const existingUser = await store.get(normalizedEmail);
    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Email already exists' })
      };
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await bcrypt.hash(password, 12);

    const userData = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    await store.set(normalizedEmail, encrypt(JSON.stringify(userData)));

    // Create token
    const token = createToken(userId, normalizedEmail);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
      },
      body: JSON.stringify({ userId, email: normalizedEmail })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Registration failed' })
    };
  }
};
