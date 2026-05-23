const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const fs = require("fs");
const path = require("path");

// ─── Config ───────────────────────────────────────────────
const TOKEN = process.env.TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

// ─── Users JSON ───────────────────────────────────────────
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUser(user) {
  const users = loadUsers();
  const exists = users.find((u) => u.id === user.id);
  if (!exists) {
    users.push({
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      joined_at: new Date().toISOString(),
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log(`✅ Yangi foydalanuvchi saqlandi: ${user.id}`);
  }
}

// ─── Telegram Bot ─────────────────────────────────────────
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "Foydalanuvchi";

  saveUser(msg.from);

  const text =
    `👋 Assalomu alaykum, *${firstName}*!\n\n` +
    `🌟 *Ourgem* ga xush kelibsiz!\n\n` +
    `Quyidagi tugma orqali veb-ilovamizni oching 👇`;

  bot.sendMessage(chatId, text, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌐 WebApp'ni ochish", web_app: { url: "https://ourgem.uz/" } }],
      ],
    },
  });
});

bot.on("polling_error", (err) => console.error("Polling xatosi:", err.message));

// ─── Express Server (Admin Panel) ─────────────────────────
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Auth middleware
function auth(req, res, next) {
  const pwd = req.headers["x-admin-password"];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: "Ruxsat yo'q" });
  next();
}

// Foydalanuvchilar ro'yxati
app.get("/api/users", auth, (req, res) => {
  const users = loadUsers();
  res.json({ count: users.length, users });
});

// Hammaga xabar yuborish
app.post("/api/broadcast", auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Xabar bo'sh" });

  const users = loadUsers();
  let success = 0, failed = 0;

  for (const user of users) {
    try {
      await bot.sendMessage(user.id, message, { parse_mode: "Markdown" });
      success++;
      await new Promise((r) => setTimeout(r, 50)); // spam himoyasi
    } catch (e) {
      console.error(`Xabar yuborilmadi ${user.id}:`, e.message);
      failed++;
    }
  }

  res.json({ success, failed, total: users.length });
});

// Stats
app.get("/api/stats", auth, (req, res) => {
  const users = loadUsers();
  const today = new Date().toDateString();
  const todayCount = users.filter(
    (u) => new Date(u.joined_at).toDateString() === today
  ).length;
  res.json({ total: users.length, today: todayCount });
});

app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlamoqda`));
