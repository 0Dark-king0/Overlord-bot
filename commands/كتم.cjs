const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("كتم")
    .setDescription("إسكات عضو مؤقتاً")
    .addUserOption((option) =>
      option.setName("عضو").setDescription("العضو المراد كتمه").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("مدة")
        .setDescription("مدة الكتم (مثال: 10m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("سبب").setDescription("سبب الكتم").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("عضو");
    const duration = interaction.options.getString("مدة");
    const reason = interaction.options.getString("سبب") || "لم يُحدد سبب";
    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member) {
      return interaction.reply({
        content: "العضو غير موجود في السيرفر.",
        ephemeral: true,
      });
    }

    // تحويل المدة إلى milliseconds
    const msDuration = ms(duration);
    if (!msDuration || msDuration > 2419200000) {
      // 28 يوم كحد أقصى
      return interaction.reply({
        content:
          "مدة غير صالحة. استخدم صيغة مثل: 10m, 1h, 1d (الحد الأقصى 28 يوم)",
        ephemeral: true,
      });
    }

    try {
      await member.timeout(msDuration, reason);

      const embed = {
        color: parseInt(config.embedColors.mute.replace("#", "0x")),
        title: "🔹 تم الكتم",
        fields: [
          { name: "العضو", value: `${targetUser}`, inline: true },
          { name: "المدة", value: duration, inline: true },
          { name: "السبب", value: reason },
        ],
        footer: { text: "Overlord - النظام فوق الجميع" },
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [embed] });

      // تسجيل في قناة اللوجات
      const logChannel = interaction.guild.channels.cache.find(
        (ch) => ch.name === config.logChannel
      );
      if (logChannel) {
        const logEmbed = {
          color: parseInt(config.embedColors.mute.replace("#", "0x")),
          title: "🔹 كتم عضو",
          fields: [
            { name: "العضو", value: `${targetUser.tag}`, inline: true },
            { name: "المنفذ", value: `${interaction.user}`, inline: true },
            { name: "المدة", value: duration, inline: true },
            { name: "السبب", value: reason },
          ],
          footer: { text: "Overlord - النظام فوق الجميع" },
          timestamp: new Date(),
        };
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error("خطأ في كتم العضو:", error);
      await interaction.reply({
        content: "حدث خطأ أثناء محاولة كتم العضو.",
        ephemeral: true,
      });
    }
  },
};
