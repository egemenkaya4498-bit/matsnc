exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed'
    };
  }

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || 'application/x-www-form-urlencoded';

    const response = await fetch('https://serverai-wtpr.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: event.body,
      duplex: 'half'
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'text/plain; charset=utf-8'
      },
      body: text
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: 'Proxy sunucusu hatası: ' + (error.message || 'Bilinmeyen hata')
    };
  }
};
