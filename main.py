from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# ضع رابط MongoDB الخاص بك هنا (الذي نسخته من موقع MongoDB Atlas)
MONGO_URI = "mongodb+srv://USER:PASSWORD@cluster.mongodb.net/myDatabase"
client = MongoClient(MONGO_URI)
db = client['sabaa_app']
users_col = db['users']

@app.route('/')
def home():
    return "سيرفر السبع يعمل بنجاح! 👑"

# دالة لجلب بيانات البروفايل أو إنشائه
@app.route('/get_user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = users_col.find_one({"user_id": user_id})
    if not user:
        user = {"user_id": user_id, "name": "مستخدم جديد", "followers": 0}
        users_col.insert_one(user)
    user.pop('_id', None)
    return jsonify(user)

# دالة المتابعة الحقيقية
@app.route('/follow', methods=['POST'])
def follow():
    data = request.json
    my_id = data.get('my_id') # معرفك أنت
    target_id = data.get('target_id') # معرف صديقك
    
    if not target_id:
        return jsonify({"error": "ID مطلوب"}), 400

    # زيادة المتابعين عند الصديق
    users_col.update_one({"user_id": target_id}, {"$inc": {"followers": 1}}, upsert=True)
    
    updated_user = users_col.find_one({"user_id": target_id})
    return jsonify({"status": "success", "new_followers": updated_user['followers']})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
