import telebot
from telebot import types
import requests
import re
import time

# --- البيانات الأساسية ---
BOT_TOKEN = '8789390021:AAH2FySSy3mOhfPWOxFMLr7aBz2BF14dvyM'
ADMIN_ID = "8085880852" # ايدي حسابك لقطع المعاينة

bot = telebot.TeleBot(BOT_TOKEN)

# دالة إرسال آمنة لتعطيل المعاينة
def safe_send(chat_id, text, markup=None):
    return bot.send_message(
        chat_id, 
        text, 
        reply_markup=markup, 
        parse_mode='HTML', 
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )

# --- واجهة البوت الرئيسية ---
@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = types.InlineKeyboardMarkup(row_width=2)
    btn1 = types.InlineKeyboardButton("🎁 أرقام مجانية", callback_data="free_num")
    btn2 = types.InlineKeyboardButton("👨‍💻 المطور السبع أبو نمر", url=f"tg://user?id={ADMIN_ID}")
    markup.add(btn1, btn2)
    
    welcome_text = "<b>🦁 مرحباً بك في بوت أرقام السبع 🦁</b>\n\nاضغط على الزر أدناه لجلب رقم مجاني فوراً."
    safe_send(message.chat.id, welcome_text, markup)

# --- معالجة جلب الرقم والكود ---
@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    if call.data == "free_num":
        bot.answer_callback_query(call.id, "جاري جلب البيانات...")
        bot.edit_message_text("🔄 <b>جاري استخراج الرقم بواسطة السبع...</b>", call.message.chat.id, call.message.message_id, parse_mode='HTML')
        
        try:
            url = "https://free-sms-receive.com/united-states/"
            res = requests.get(url, timeout=10)
            numbers = re.findall(r'\+\d{11}', res.text)
            
            if numbers:
                target_num = numbers[0]
                num_only = target_num.replace('+', '')
                
                # الرسالة الأولى: بيانات الرقم
                info_text = (
                    "👑 <b>مرسال الرقم السبع أبو نمر</b>\n\n"
                    f"📱 <b>الرقم:</b> <code>{target_num}</code>\n"
                    "🌍 <b>الدولة:</b> الولايات المتحدة 🇺🇸\n"
                    "⏳ <b>الكود:</b> جاري الانتظار...\n"
                    "🛠 <b>المهنة:</b> تليجرام / واتساب / فيس"
                )
                safe_send(call.message.chat.id, info_text)
                
                # فحص الكود تلقائياً
                for _ in range(10):
                    time.sleep(15)
                    msg_res = requests.get(f"https://free-sms-receive.com/number/{num_only}/", timeout=10)
                    codes = re.findall(r'Telegram code: (\d{5})', msg_res.text)
                    
                    if codes:
                        final_text = (
                            "👑 <b>مرسال الرقم السبع أبو نمر</b>\n\n"
                            f"📱 <b>الرقم:</b> <code>{target_num}</code>\n"
                            "🌍 <b>الدولة:</b> الولايات المتحدة 🇺🇸\n"
                            f"📩 <b>الكود:</b> <code>{codes[0]}</code>\n"
                            "🛠 <b>المهنة:</b> تليجرام ✅"
                        )
                        safe_send(call.message.chat.id, final_text)
                        return
                
                safe_send(call.message.chat.id, "⚠️ انتهى الوقت ولم يصل كود جديد لهذا الرقم.")
            else:
                safe_send(call.message.chat.id, "❌ لا توجد أرقام متاحة حالياً.")
        except:
            safe_send(call.message.chat.id, "⚠️ حدث خطأ فني أثناء جلب الرقم.")

bot.polling()
