import os
import json
import google.generativeai as genai

def handler(event, context):
    try:
        genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
        body = json.loads(event['body'])
        user_input = body.get('message')

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(f"Sen bir matematik canavarısın. Eğer kullanıcı resim çiz derse cevaba 'GEN_IMG: [betimleme]' ekle. Soru: {user_input}")

        return {
            'statusCode': 200,
            'body': json.dumps({'text': response.text})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}
