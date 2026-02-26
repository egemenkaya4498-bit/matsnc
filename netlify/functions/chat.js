// netlify/functions/chat.js
exports.handler = async (event) => {
  // Sadece POST isteklerine izin ver
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, chatId } = JSON.parse(event.body);

    // Burada hedef API'n https://servers-1as.onrender.com
    const response = await fetch('https://servers-1as.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatId }) // API'nin beklediği formata göre düzenle
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS header'ı ekle
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Proxy hatası: ' + err.message })
    };
  }
};
