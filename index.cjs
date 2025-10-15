const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

// تحميل الأوامر من مجلد commands
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".cjs"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ تم تحميل الأمر: ${command.data.name}`);
    }
  }
}

// تحميل الأحداث من مجلد events
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".cjs"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ تم تحميل الحدث: ${event.name}`);
  }
}

// تسجيل الدخول إلى Discord
client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error("❌ خطأ في تسجيل الدخول:", error);
  process.exit(1);
});

// معالجة الأخطاء
process.on("unhandledRejection", (error) => {
  console.error("خطأ غير معالج:", error);
});

process.on("uncaughtException", (error) => {
  console.error("استثناء غير معالج:", error);
});

module.exports = client;
