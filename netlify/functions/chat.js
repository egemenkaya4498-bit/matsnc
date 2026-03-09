exports.handler = async function(event, context) {
    // CORS preflight
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
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        let message = '';
        const contentType = event.headers['content-type'] || '';

        if (contentType.includes('application/json')) {
            const body = JSON.parse(event.body || '{}');
            message = body.message || '';
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const params = new URLSearchParams(event.body || '');
            message = params.get('message') || '';
        } else {
            // multipart/form-data veya diğer
            // Body'den message'ı regex ile çek
            const body = event.body || '';
            const match = body.match(/name="message"\r?\n\r?\n([^\r\n-]+)/);
            if (match) message = match[1];
        }

        if (!message) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Mesaj boş' })
            };
        }

        // Render sunucusuna ilet (server to server, CORS yok)
        const formData = new URLSearchParams();
        formData.append('message', message);

        const response = await fetch('https://server-1as.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`Render sunucu hatası: ${response.status}`);
        }

        const text = await response.text();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain; charset=utf-8'
            },
            body: text
        };

    } catch (error) {
        console.error('Netlify Function Hatası:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
