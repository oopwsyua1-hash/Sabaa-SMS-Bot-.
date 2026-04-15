import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)  # لضمان قبول الاتصال من تطبيقك (HTML)

# الرابط الخاص بك مع إضافة حل مشكلة الـ SSL لـ Render
MONGO_URI = "mongodb+srv://yyqp555_db_user:l3WH92tTtJADasI7@cluster0.gwjrncq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true"

try:
    # إعداد العميل مع مهلة زمنية 5 ثوانٍ للاتصال
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client['SabaaDB']  # اسم قاعدة البيانات
    followers_collection = db['followers']  # اسم الجدول (Collection)
    
    # اختبار الاتصال الفعلي
    client.admin.command('ping')
    print("تم الاتصال بقاعدة البيانات بنجاح ✅")
except Exception as e:
    print(f"فشل الاتصال بقاعدة البيانات: {e}")

@app.route('/')
def home():
    return "سيرفر السبع يعمل بنجاح! 🚀"

@app.route('/follow', methods=['POST'])
def follow():
    try:
        data = request.json
        username = data.get('username', 'مستخدم مجهول')
        rank = data.get('rank', 'عضو ملكي')
        
        # تخزين بيانات المتابع الحقيقي في MongoDB
        follower_data = {
            "username": username,
            "rank": rank,
            "date": datetime.utcnow()
        }
        
        followers_collection.insert_one(follower_data)
        
        # الرد على التطبيق بنجاح
        return jsonify({
            "status": "success",
            "message": f"أهلاً بك يا {username} في جيش السبع!",
            "total_followers": followers_collection.count_documents({})
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # تحديد المنفذ تلقائياً ليتوافق مع Render
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
