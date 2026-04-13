import telebot
from telebot import types
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

# --- واجهة البوت الرئيسية ---
@bot.message_handler(commands=['start'])
def send_welcome(message):
    if message.from_user.id == ADMIN_ID:
        markup = types.InlineKeyboardMarkup(row_width=2)
        
        # أزرار الخدمات
        btn1 = types.InlineKeyboardButton("🇺🇸 طلب رقم أمريكي", callback_data="buy_usa")
        btn2 = types.InlineKeyboardButton("🎁 أرقام مجانية", url="https://receive-smss.com/")
        btn3 = types.InlineKeyboardButton("💰 شحن الرصيد", callback_data="recharge")
        btn4 = types.InlineKeyboardButton("🛠 الدعم الفني", url="https://t.me/your_username") # ضع يوزرك هنا
        
        markup.add(btn1, btn2, btn3, btn4)
        
        welcome_text = (
            "<b>✨ أهلاً بك في بوت أرقام السبع المتطور ✨</b>\n\n"
            "🛡 <b>حالة الحساب:</b> مفعّل (مطور)\n"
            "🚀 <b>الخدمة:</b> جاهزة للاستخدام\n\n"
            "<i>اختر من القائمة أدناه لبدء العمل:</i>"
        )
        bot.send_message(message.chat.id, welcome_text, reply_markup=markup, parse_mode='HTML')
    else:
        bot.reply_to(message, "❌ هذا البوت مخصص للمطور فقط.")

# --- معالجة الضغط على الأزرار ---
@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    if call.data == "buy_usa":
        bot.answer_callback_query(call.id, "جاري معالجة طلبك... ⏳")
        bot.edit_message_text("🔄 <b>جاري سحب رقم جديد من 5Sim...</b>", call.message.chat.id, call.message.message_id, parse_mode='HTML')
        
        # طلب الرقم
        url = "https://5sim.net/v1/user/buy/activation/usa/any/telegram"
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                phone = data['phone']
                order_id = data['id']
                bot.send_message(call.message.chat.id, f"✅ <b>تم استلام الرقم بنجاح!</b>\n\nالرقم: <code>{phone}</code>\n\n<i>قم بإدخاله الآن وانتظر وصول الكود...</i>", parse_mode='HTML')
                
                # فحص الكود تلقائياً
                for _ in range(15):
                    time.sleep(10)
                    check = requests.get(f"https://5sim.net/v1/user/check/{order_id}", headers=headers).json()
                    if check.get('sms'):
                        code = check['sms'][0]['code']
                        bot.send_message(call.message.chat.id, f"📩 <b>كود التفعيل هو:</b>\n\n<code>{code}</code>", parse_mode='HTML')
                        return
                bot.send_message(call.message.chat.id, "⚠️ انتهى الوقت ولم يصل الكود.")
            else:
                bot.send_message(call.message.chat.id, "❌ <b>فشل الطلب:</b> تأكد من شحن رصيدك في 5Sim.")
        except:
            bot.send_message(call.message.chat.id, "⚠️ حدث خطأ في الاتصال بالمزود.")

    elif call.data == "recharge":
        bot.send_message(call.message.chat.id, "💳 لشحن رصيدك، يرجى التواصل مع الإدارة أو استخدام بوابة الفيزا في موقع 5Sim مباشرة.")

bot.polling()
