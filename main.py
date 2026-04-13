import telebot
import requests
import time

# --- البيانات الخاصة بك ---
BOT_TOKEN = '8789390021:AAH2FySSy3mOhfPWOxFMLr7aBz2BF14dvyM'
API_KEY = 'EyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDc2NDAzOTksImlhdCI6MTc3NjEwNDM5OSwicmF5IjoiZDljMTY5ZjI5MDJmNjI1ZTEzNjJkZDM5YWEyODhhNjIiLCJzdWIiOjM5Njg4NTF9.u8-OIop-4JsmvUY0WzInW2NV_2oTRXC4xx-nWzGK-tdQQA_GQLf5kJ7oI3bEQDnj9VT8tw74sFVc9l-bQxbZrzopJebgCAh5CAPh4acaQJ0Ksw1iTYAVp6FEWTp5Yq2M3zAz7OnTykTp0cJUOu6T2xEn6tjg36pn60pg5so2CxixInDV1-rVAtNY7v2qwiNWyd92MXJFyEhoJrDblsR9kKeFxeR4_QYVknByGrh2ZJ3RfT3k35Y_NLr_t8aqOcfD99fZqMYIy0AvR0ePfDQY3xXE-5n2rsoCtMKyy5MfwGBxKlrtwvU4TVYrZ3E50pJeDGfDuo84uNb1JF3LjSypbg'
ADMIN_ID = 8085880852

bot = telebot.TeleBot(BOT_TOKEN)
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Accept': 'application/json',
}

@bot.message_handler(commands=['start'])
def send_welcome(message):
    if message.from_user.id == ADMIN_ID:
        markup = telebot.types.InlineKeyboardMarkup()
        btn = telebot.types.InlineKeyboardButton("طلب رقم أمريكي 🇺🇸", callback_data="buy_usa")
        markup.add(btn)
        bot.reply_to(message, "مرحباً بك يا مبرمج. اضغط لطلب رقم تليجرام أمريكي:", reply_markup=markup)
    else:
        bot.reply_to(message, "عذراً، هذا البوت خاص بالمطور فقط.")

@bot.callback_query_handler(func=lambda call: call.data == "buy_usa")
def handle_buy(call):
    bot.edit_message_text("جاري طلب الرقم من 5Sim...", call.message.chat.id, call.message.message_id)
    
    # طلب رقم أمريكي لتطبيق تليجرام
    url = "https://5sim.net/v1/user/buy/activation/usa/any/telegram"
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        
        if 'phone' in data:
            order_id = data['id']
            phone = data['phone']
            bot.send_message(call.message.chat.id, f"✅ تم استلام الرقم:\n`{phone}`\n\nأدخله الآن في تليجرام، وسأرسل لك الكود هنا فور وصوله.")
            
            # محاولة جلب الكود (فحص كل 10 ثوانٍ لمدة دقيقتين)
            for i in range(12):
                time.sleep(10)
                check_url = f"https://5sim.net/v1/user/check/{order_id}"
                check_res = requests.get(check_url, headers=headers).json()
                
                if check_res.get('sms'):
                    code = check_res['sms'][0]['code']
                    bot.send_message(call.message.chat.id, f"📩 وصل كود التفعيل الخاص بك:\n`{code}`")
                    return
            
            bot.send_message(call.message.chat.id, "❌ انتهى الوقت ولم يصل الكود. حاول مرة أخرى.")
        else:
            bot.send_message(call.message.chat.id, f"❌ خطأ: {data.get('errors', 'لا يوجد رصيد أو أرقام حالياً')}")
            
    except Exception as e:
        bot.send_message(call.message.chat.id, f"⚠️ حدث خطأ تقني: {str(e)}")

bot.polling()
