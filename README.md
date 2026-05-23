# OurGem Telegram Bot 🤖

Telegram bot + Admin panel loyihasi.

## Fayllar tuzilmasi

```
ourgem-bot/
├── bot.js          # Bot + Express server
├── package.json
├── railway.json    # Railway konfiguratsiya
├── users.json      # Avtomatik yaratiladi
└── public/
    └── index.html  # Admin panel
```

## Railway ga joylash

### 1. GitHub ga yuklash
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/ourgem-bot.git
git push -u origin main
```

### 2. Railway sozlash
1. [railway.app](https://railway.app) ga kiring
2. **New Project → Deploy from GitHub repo** tanlang
3. Reponi tanlang
4. **Variables** bo'limiga o'ting va qo'shing:

| Variable | Qiymat |
|----------|--------|
| `TOKEN` | BotFather dan olgan token |
| `ADMIN_PASSWORD` | Admin panel paroli (o'zingiz belgilang) |

### 3. Deployment
Railway avtomatik `npm install` va `node bot.js` ishlatadi.

## Admin panel
Railway sizga URL beradi, masalan:
`https://ourgem-bot-production.up.railway.app`

Shu URL ga kirsangiz admin panel ochiladi.

## Funksiyalar
- ✅ /start — foydalanuvchini saqlash + WebApp tugmasi
- ✅ Admin panel — foydalanuvchilar ro'yxati
- ✅ Broadcast — hammaga xabar yuborish
- ✅ Statistika — jami va bugungi foydalanuvchilar
