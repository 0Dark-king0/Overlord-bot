const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("حظر")
    .setDescription("حظر عضو من السيرفر")
    .addUserOption((option) =>
      option.setName("عضو").setDescription("العضو المراد حظره").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("سبب").setDescription("سبب الحظر").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("عضو");
    const reason = interaction.options.getString("سبب") || "لم يُحدد سبب";
    const member = interaction.guild.members.cache.get(targetUser.id);

    if (member && !member.bannable) {
      return interaction.reply({
        content: "لا يمكنني حظر هذا العضو. تحقق من الأذونات والأدوار.",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.ban(targetUser, { reason });

      const embed = {
        color: parseInt(config.embedColors.warning.replace("#", "0x")),
        title: "⚠️ تم الحظر",
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
          title: "⚠️ حظر عضو",
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
      console.error("خطأ في حظر العضو:", error);
      await interaction.reply({
        content: "حدث خطأ أثناء محاولة حظر العضو.",
        ephemeral: true,
      });
    }
  },
};
