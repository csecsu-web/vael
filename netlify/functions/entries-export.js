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
    const store = getStore('reflection-entries');

    // Get all entries for this user
    const { blobs } = await store.list({ prefix: user.userId });

    const exportData = {
      userId: user.userId,
      email: user.email,
      exportedAt: new Date().toISOString(),
      daily: [],
      weekly: [],
      monthly: [],
      lifeos: null
    };

    for (const blob of blobs) {
      try {
        const encryptedData = await store.get(blob.key);
        if (encryptedData) {
          const data = JSON.parse(decrypt(encryptedData));
          const keyParts = blob.key.split(':');
          const type = keyParts[1];

          if (type === 'daily') {
            exportData.daily.push(data);
          } else if (type === 'weekly') {
            exportData.weekly.push(data);
          } else if (type === 'monthly') {
            exportData.monthly.push(data);
          } else if (type === 'lifeos') {
            exportData.lifeos = data;
          }
        }
      } catch (err) {
        console.error('Error decrypting entry:', err);
        // Skip invalid entries
      }
    }

    // Sort arrays by date
    exportData.daily.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    exportData.weekly.sort((a, b) => (a.weekKey || '').localeCompare(b.weekKey || ''));
    exportData.monthly.sort((a, b) => (a.monthKey || '').localeCompare(b.monthKey || ''));

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="reflection-export-${new Date().toISOString().split('T')[0]}.json"`
      },
      body: JSON.stringify(exportData, null, 2)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token provided' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ error: err.message || 'Failed to export data' })
    };
  }
};
