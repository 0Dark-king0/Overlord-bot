const config = require("../config.json");
const { addWarning, getWarningCount } = require("../utils/warningSystem.cjs");
const { generateMentionReply, generateWarningReply } = require("../utils/aiReply.cjs");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // تجاهل رسائل البوتات
    if (message.author.bot) return;

    // تجاهل الرسائل خارج السيرفرات
    if (!message.guild) return;

    // فحص الكلمات المسيئة
    const hasBadWord = config.badWords.some((word) =>
      message.content.toLowerCase().includes(word)
    );

    if (hasBadWord) {
      // التحقق من الأدوار المستثناة
      const member = message.member;
      const hasExemptRole = config.exemptRoles.some((roleName) =>
        member.roles.cache.some((role) => role.name === roleName)
      );

      if (!hasExemptRole) {
        try {
          // حذف الرسالة فوراً
          await message.delete();

          // إضافة تحذير
          const warningCount = await addWarning(
            message.author.id,
            "استخدام كلمات مخالفة"
          );

          // إرسال تحذير للعضو
          const warningText = await generateWarningReply(
            "استخدام كلمات مخالفة",
            warningCount
          );

          const warningEmbed = {
            color: parseInt(config.embedColors.warning.replace("#", "0x")),
            title: "⚠️ تحذير",
            description: warningText,
            fields: [
              {
                name: "عدد التحذيرات",
                value: `${warningCount}/${config.maxWarnings}`,
              },
            ],
            footer: { text: "Overlord - النظام فوق الجميع" },
            timestamp: new Date(),
          };

          const reply = await message.channel.send({
            content: `${message.author}`,
            embeds: [warningEmbed],
          });

          // حذف رسالة التحذير بعد 10 ثواني
          setTimeout(() => reply.delete().catch(() => {}), 10000);

          // تسجيل في قناة اللوجات
          const logChannel = message.guild.channels.cache.find(
            (ch) => ch.name === config.logChannel
          );

          if (logChannel) {
            const logEmbed = {
              color: parseInt(config.embedColors.warning.replace("#", "0x")),
              title: "⚠️ كلمة مخالفة",
              fields: [
                {
                  name: "العضو",
                  value: `${message.author.tag}`,
                  inline: true,
                },
                {
                  name: "القناة",
                  value: `${message.channel}`,
                  inline: true,
                },
                {
                  name: "التحذيرات",
                  value: `${warningCount}/${config.maxWarnings}`,
                  inline: true,
                },
                {
                  name: "الرسالة المحذوفة",
                  value: message.content.substring(0, 200),
                },
              ],
              footer: { text: "Overlord - النظام فوق الجميع" },
              timestamp: new Date(),
            };
            await logChannel.send({ embeds: [logEmbed] });
          }

          // كتم تلقائي عند تجاوز الحد الأقصى من التحذيرات
          if (warningCount >= config.maxWarnings) {
            try {
              await member.timeout(
                config.autoMuteDuration,
                `تجاوز الحد الأقصى من التحذيرات (${warningCount})`
              );

              const muteEmbed = {
                color: parseInt(config.embedColors.mute.replace("#", "0x")),
                title: "🔹 كتم تلقائي",
                description: `تم كتم ${message.author} تلقائياً لتجاوز الحد الأقصى من التحذيرات.`,
                fields: [
                  {
                    name: "المدة",
                    value: `${config.autoMuteDuration / 60000} دقيقة`,
                  },
                ],
                footer: { text: "Overlord - النظام فوق الجميع" },
                timestamp: new Date(),
              };

              await message.channel.send({ embeds: [muteEmbed] });

              if (logChannel) {
                await logChannel.send({ embeds: [muteEmbed] });
              }
            } catch (error) {
              console.error("خطأ في الكتم التلقائي:", error);
            }
          }
        } catch (error) {
          console.error("خطأ في معالجة الكلمة المسيئة:", error);
        }
      }
    }

    // الرد على المنشن
    if (message.mentions.has(message.client.user)) {
      try {
        const replyText = await generateMentionReply(message.content);
        await message.reply(replyText);
      } catch (error) {
        console.error("خطأ في الرد على المنشن:", error);
        await message.reply("المراقبة مستمرة.");
      }
    }
  },
};
