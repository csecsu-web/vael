const { corsHeaders } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Set-Cookie': 'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    },
    body: JSON.stringify({ message: 'Logged out' })
  };
};
