const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("مسح")
    .setDescription("حذف عدد محدد من الرسائل")
    .addIntegerOption((option) =>
      option
        .setName("عدد")
        .setDescription("عدد الرسائل المراد حذفها (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger("عدد");

    try {
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });
      await interaction.channel.bulkDelete(messages, true);

      const embed = {
        color: parseInt(config.embedColors.success.replace("#", "0x")),
        title: "🔹 تم تنفيذ الأمر",
        description: `تم حذف ${messages.size} رسالة بنجاح.`,
        footer: { text: "Overlord - النظام فوق الجميع" },
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });

      // تسجيل في قناة اللوجات
      const logChannel = interaction.guild.channels.cache.find(
        (ch) => ch.name === config.logChannel
      );
      if (logChannel) {
        const logEmbed = {
          color: parseInt(config.embedColors.info.replace("#", "0x")),
          title: "🔹 مسح رسائل",
          fields: [
            { name: "المنفذ", value: `${interaction.user}`, inline: true },
            { name: "القناة", value: `${interaction.channel}`, inline: true },
            { name: "العدد", value: `${messages.size}`, inline: true },
          ],
          footer: { text: "Overlord - النظام فوق الجميع" },
          timestamp: new Date(),
        };
        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error("خطأ في مسح الرسائل:", error);
      await interaction.reply({
        content: "حدث خطأ أثناء محاولة مسح الرسائل.",
        ephemeral: true,
      });
    }
  },
};
