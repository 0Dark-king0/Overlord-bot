const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("فك_الكتم")
    .setDescription("إزالة الكتم عن عضو")
    .addUserOption((option) =>
      option
        .setName("عضو")
        .setDescription("العضو المراد فك كتمه")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("عضو");
    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member) {
      return interaction.reply({
        content: "العضو غير موجود في السيرفر.",
        ephemeral: true,
      });
    }

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({
        content: "هذا العضو غير مكتوم.",
        ephemeral: true,
      });
    }

    try {
      await member.timeout(null);

      const embed = {
        color: parseInt(config.embedColors.success.replace("#", "0x")),
        title: "🔹 تم فك الكتم",
        description: `تم إزالة الكتم عن ${targetUser}`,
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
          color: parseInt(config.embedColors.success.replace("#", "0x")),
          title: "🔹 فك كتم",
          fields: [
            { name: "العضو", value: `${targetUser.tag}`, inline: true },
            { name: "المنفذ", value: `${interaction.user}`, inline: true },
          ],
          footer: { text: "Overlord - النظام فوق الجميع" },
          timestamp: new Date(),
        };
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error("خطأ في فك كتم العضو:", error);
      await interaction.reply({
        content: "حدث خطأ أثناء محاولة فك كتم العضو.",
        ephemeral: true,
      });
    }
  },
};
