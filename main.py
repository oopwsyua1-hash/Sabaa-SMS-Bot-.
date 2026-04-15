from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import threading
import time
import requests
import os

app = Flask(__name__)
CORS(app)

# --- إعدادات قاعدة البيانات ---
# استبدل الرابط التالي برابط Connection String الذي حصلت عليه من MongoDB Atlas
# تأكد من وضع كلمة المرور الصحيحة مكان كلمة <password>
MONGO_URI = "mongodb+srv://qusai_admin:كلمة_مرورك_هنا@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(MONGO_URI)
    db = client['sabaa_database']
    users_col = db['users']
    print("تم الاتصال بقاعدة البيانات بنجاح ✅")
except Exception as e:
    print(f"فشل الاتصال: {e}")

# --- نظام النبض (Keep-Alive) لمنع السيرفر من النوم ---
def keep_alive():
    while True:
        try:
            # انتظر حتى يعمل السيرفر ثم ابدأ بمناداته
            # ملاحظة: ضع رابط Render الخاص بك هنا بعد أن تحصل عليه
            server_url = "https://your-app-name.onrender.com/" 
            requests.get(server_url)
            print("النبض مستمر.. السيرفر مستيقظ 24 ساعة ✅")
        except:
            print("السيرفر لم يشتغل بعد أو الرابط غير صحيح..")
        time.sleep(600) # يرسل طلب كل 10 دقائق

# تشغيل النبض في خلفية السيرفر
threading.Thread(target=keep_alive, daemon=True).start()

# --- المسارات (Routes) ---

@app.route('/')
def home():
    return "سيرفر السبع (Sab3 AI) يعمل الآن بكامل قوته! 👑"

# 1. جلب بيانات المستخدم أو إنشاؤه عند البحث
@app.route('/get_profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    user = users_col.find_one({"user_id": user_id})
    if not user:
        # إذا كان المستخدم جديداً، ننشئ له ملفاً
        new_user = {
            "user_id": user_id,
            "name": "مستخدم جديد",
            "followers": 0,
            "rank": "عضو"
        }
        users_col.insert_one(new_user)
        user = new_user
    
    user.pop('_id', None) # إزالة معرف مونجو الداخلي
    return jsonify(user)

# 2. نظام المتابعة الحقيقي
@app.route('/follow', methods=['POST'])
def follow():
    data = request.json
    target_id = data.get('target_id') # الشخص الذي ستتابعه
    
    if not target_id:
        return jsonify({"status": "error", "message": "ID مطلوب"}), 400

    # زيادة عدد المتابعين للشخص المستهدف
    result = users_col.find_one_and_update(
        {"user_id": target_id},
        {"$inc": {"followers": 1}},
        return_document=True
    )
    
    if result:
        return jsonify({
            "status": "success", 
            "new_followers": result.get('followers', 0)
        })
    return jsonify({"status": "error", "message": "المستخدم غير موجود"}), 404

if __name__ == '__main__':
    # Render يستخدم منفذ متغير، لذا نستخدم os.environ لجلب المنفذ
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
