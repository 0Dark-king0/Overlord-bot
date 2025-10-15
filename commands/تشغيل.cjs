const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { checkPermissions, createPermissionEmbed } = require("../utils/permissionCheck.cjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("تشغيل")
    .setDescription("فحص أذونات البوت وتشغيل النظام")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    const statusEmbed = {
      color: 0x36393f,
      title: "⚙️ فحص الأذونات",
      description: "يتم فحص الأذونات المطلوبة...",
      footer: { text: "Overlord - النظام فوق الجميع" },
      timestamp: new Date(),
    };

    await interaction.editReply({ embeds: [statusEmbed] });

    // تأخير لمحاكاة عملية الفحص
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const permissionStatus = checkPermissions(interaction.guild);
    const permissionEmbed = createPermissionEmbed(permissionStatus);

    await interaction.editReply({ embeds: [permissionEmbed] });

    // إنشاء قناة اللوجات إن لم تكن موجودة
    const config = require("../config.json");
    let logChannel = interaction.guild.channels.cache.find(
      (ch) => ch.name === config.logChannel
    );

    if (!logChannel && permissionStatus.allGranted) {
      try {
        logChannel = await interaction.guild.channels.create({
          name: config.logChannel,
          type: 0,
          topic: "سجلات نظام Overlord - جميع الإجراءات تُسجل هنا",
        });

        const welcomeEmbed = {
          color: 0x2d5f2d,
          title: "🔹 نظام Overlord",
          description:
            "تم تشغيل النظام بنجاح.\nهذه القناة مخصصة لتسجيل جميع إجراءات الإدارة والمراقبة.",
          fields: [
            {
              name: "المراقبة",
              value: "✅ مراقبة الكلمات المسيئة نشطة",
            },
            {
              name: "التحذيرات",
              value: "✅ نظام التحذيرات التلقائي نشط",
            },
            {
              name: "الأوامر",
              value: "✅ جميع الأوامر الإدارية جاهزة",
            },
          ],
          footer: { text: "Overlord - النظام فوق الجميع" },
          timestamp: new Date(),
        };

        await logChannel.send({ embeds: [welcomeEmbed] });

        await interaction.followUp({
          content: `✅ تم إنشاء قناة السجلات: ${logChannel}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("خطأ في إنشاء قناة اللوجات:", error);
      }
    }
  },
};
