import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`✅ تم تسجيل الدخول كـ ${client.user.tag}`);
  client.user.setActivity("إدارة السيرفرات 👑", { type: 0 });
});

// كلمات ممنوعة قوية
const bannedWords = ["كلمة1", "كلمة2", "كلمة3", "كلمة4"];

// عند وصول رسالة
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // فحص الكلمات الممنوعة
  const lower = message.content.toLowerCase();
  if (bannedWords.some(word => lower.includes(word))) {
    await message.delete().catch(() => {});
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("DarkRed")
          .setTitle("🚫 تم حذف الرسالة")
          .setDescription(`> **${message.author.username}**، رسالتك احتوت على كلمات غير مسموح بها.`)
      ]
    });
  }

  // أمر فحص الأذونات
  if (message.content === "!فحص") {
    const permissionsNeeded = [
      "ManageMessages",
      "KickMembers",
      "BanMembers",
      "ManageRoles",
      "SendMessages"
    ];

    const missing = permissionsNeeded.filter(p => !message.guild.members.me.permissions.has(p));
    if (missing.length > 0) {
      return message.reply(`🚫 أحتاج إلى الأذونات التالية: ${missing.join(", ")}`);
    }

    message.reply("✅ جميع الأذونات متوفرة، البوت جاهز للعمل.");
  }

  // أمر مسح
  if (message.content.startsWith("!مسح")) {
    const args = message.content.split(" ");
    const count = parseInt(args[1]) || 5;
    if (!message.member.permissions.has("ManageMessages"))
      return message.reply("🚫 لا تمتلك صلاحية المسح.");

    await message.channel.bulkDelete(count, true);
    message.channel.send(`🧹 تم حذف ${count} رسالة.`).then(msg => setTimeout(() => msg.delete(), 3000));
  }

  // أمر بسيط (تجريبي)
  if (message.content === "ping") {
    message.reply("🏓 Pong!");
  }
});

// تسجيل الدخول
client.login(process.env.TOKEN);