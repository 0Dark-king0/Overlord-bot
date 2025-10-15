const { PermissionFlagsBits } = require("discord.js");

/**
 * الأذونات المطلوبة للبوت
 */
const REQUIRED_PERMISSIONS = [
  { name: "إدارة الرسائل", flag: PermissionFlagsBits.ManageMessages },
  { name: "طرد الأعضاء", flag: PermissionFlagsBits.KickMembers },
  { name: "حظر الأعضاء", flag: PermissionFlagsBits.BanMembers },
  { name: "إدارة الأدوار", flag: PermissionFlagsBits.ManageRoles },
  { name: "إرسال الرسائل", flag: PermissionFlagsBits.SendMessages },
  { name: "إرسال Embeds", flag: PermissionFlagsBits.EmbedLinks },
];

/**
 * فحص الأذونات المطلوبة
 * @param {Guild} guild - السيرفر
 * @returns {Object} - نتيجة الفحص
 */
function checkPermissions(guild) {
  const botMember = guild.members.me;
  const missing = [];
  const granted = [];

  REQUIRED_PERMISSIONS.forEach((perm) => {
    if (botMember.permissions.has(perm.flag)) {
      granted.push(perm.name);
    } else {
      missing.push(perm.name);
    }
  });

  return {
    allGranted: missing.length === 0,
    granted,
    missing,
  };
}

/**
 * إنشاء رسالة حالة الأذونات
 * @param {Object} permissionStatus - نتيجة فحص الأذونات
 * @returns {Object} - Embed object
 */
function createPermissionEmbed(permissionStatus) {
  const { allGranted, granted, missing } = permissionStatus;

  if (allGranted) {
    return {
      color: 0x2d5f2d,
      title: "⚙️ فحص الأذونات",
      description: "جميع الأذونات متوفرة. النظام جاهز للعمل.",
      fields: [
        {
          name: "الأذونات المتوفرة",
          value: granted.join("\n"),
        },
      ],
      footer: { text: "Overlord - النظام فوق الجميع" },
      timestamp: new Date(),
    };
  } else {
    return {
      color: 0x8b0000,
      title: "⚠️ أذونات ناقصة",
      description: "يرجى من الإدارة منح الأذونات المطلوبة للتمكن من العمل بشكل كامل.",
      fields: [
        {
          name: "✅ الأذونات المتوفرة",
          value: granted.length > 0 ? granted.join("\n") : "لا يوجد",
          inline: true,
        },
        {
          name: "❌ الأذونات الناقصة",
          value: missing.join("\n"),
          inline: true,
        },
      ],
      footer: { text: "Overlord - النظام فوق الجميع" },
      timestamp: new Date(),
    };
  }
}

/**
 * فحص صلاحية عضو لاستخدام أمر إداري
 */
function canUseAdminCommand(member) {
  return (
    member.permissions.has(PermissionFlagsBits.ManageMessages) ||
    member.permissions.has(PermissionFlagsBits.Administrator)
  );
}

module.exports = {
  checkPermissions,
  createPermissionEmbed,
  canUseAdminCommand,
  REQUIRED_PERMISSIONS,
};
