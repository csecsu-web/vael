const { verifyToken, corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const user = verifyToken(event.headers);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ userId: user.userId, email: user.email })
    };
  } catch (err) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not authenticated' })
    };
  }
};
