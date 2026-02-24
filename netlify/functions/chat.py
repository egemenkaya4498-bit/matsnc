import os
import json
import google.generativeai as genai
from PIL import Image
from io import BytesIO
import base64

# API Ayarları
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

def handler(event, context):
    # CORS Ön Kontrolü (Preflight)
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': ''
        }

    try:
        # Netlify event'inden veriyi al
        body = json.loads(event['body'])
        user_message = body.get('message', '')
        history = body.get('history', []) # Frontend'den gelen geçmiş
        image_data = body.get('image') # Base64 formatında resim

        parts = []
        
        # Resim varsa ekle
        if image_data:
            img_bytes = base64.b64decode(image_data.split(',')[1])
            img = Image.open(BytesIO(img_bytes))
            parts.append(img)
            
        # Mesajı ekle
        parts.append(user_message)

        # Model Kurulumu
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction="Sen Matematik Canavarı 1.0'sın. Kaya Studios tarafından geliştirildin. 8. sınıf öğrencilerine hitap ediyorsun. Eğer kullanıcı 'resim oluştur' derse, cevabının başına 'IMAGE_GEN:' ekleyerek bir görsel betimlemesi yaz. Matematik sorularını adım adım çöz ve her zaman Türkçe konuş."
        )

        # Geçmişle birlikte sohbeti başlat
        chat = model.start_chat(history=history)
        response = chat.send_message(parts)

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'text': response.text})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

