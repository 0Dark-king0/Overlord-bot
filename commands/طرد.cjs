const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("طرد")
    .setDescription("طرد عضو من السيرفر")
    .addUserOption((option) =>
      option.setName("عضو").setDescription("العضو المراد طرده").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("سبب").setDescription("سبب الطرد").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("عضو");
    const reason = interaction.options.getString("سبب") || "لم يُحدد سبب";
    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member) {
      return interaction.reply({
        content: "العضو غير موجود في السيرفر.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "لا يمكنني طرد هذا العضو. تحقق من الأذونات والأدوار.",
        ephemeral: true,
      });
    }

    try {
      await member.kick(reason);

      const embed = {
        color: parseInt(config.embedColors.success.replace("#", "0x")),
        title: "🔹 تم الطرد",
        fields: [
          { name: "العضو", value: `${targetUser}`, inline: true },
          { name: "السبب", value: reason, inline: true },
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
          color: parseInt(config.embedColors.warning.replace("#", "0x")),
          title: "⚠️ طرد عضو",
          fields: [
            { name: "العضو", value: `${targetUser.tag}`, inline: true },
            { name: "المنفذ", value: `${interaction.user}`, inline: true },
            { name: "السبب", value: reason },
          ],
          footer: { text: "Overlord - النظام فوق الجميع" },
          timestamp: new Date(),
        };
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error("خطأ في طرد العضو:", error);
      await interaction.reply({
        content: "حدث خطأ أثناء محاولة طرد العضو.",
        ephemeral: true,
      });
    }
  },
};
