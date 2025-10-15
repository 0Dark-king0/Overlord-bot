module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log("\n═══════════════════════════════════════════");
    console.log(`⚔️  Overlord Bot جاهز للعمل`);
    console.log(`📊 متصل كـ: ${client.user.tag}`);
    console.log(`🔢 عدد السيرفرات: ${client.guilds.cache.size}`);
    console.log(`👥 عدد الأعضاء: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);
    console.log("═══════════════════════════════════════════\n");

    // تعيين حالة البوت
    client.user.setPresence({
      activities: [{ name: "المراقبة لا تتوقف", type: 3 }],
      status: "dnd",
    });

    console.log("✅ النظام جاهز للتنفيذ");
    console.log("🔍 المراقبة التلقائية نشطة");
    console.log("📝 نظام التحذيرات نشط\n");
  },
};
