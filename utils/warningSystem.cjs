const fs = require("fs").promises;
const path = require("path");

const WARNINGS_FILE = path.join(__dirname, "..", "data", "warnings.json");

/**
 * تحميل التحذيرات من الملف
 */
async function loadWarnings() {
  try {
    const data = await fs.readFile(WARNINGS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

/**
 * حفظ التحذيرات في الملف
 */
async function saveWarnings(warnings) {
  await fs.writeFile(WARNINGS_FILE, JSON.stringify(warnings, null, 2));
}

/**
 * إضافة تحذير لعضو
 */
async function addWarning(userId, reason) {
  const warnings = await loadWarnings();

  if (!warnings[userId]) {
    warnings[userId] = {
      count: 0,
      history: [],
    };
  }

  warnings[userId].count++;
  warnings[userId].history.push({
    reason,
    timestamp: new Date().toISOString(),
  });

  await saveWarnings(warnings);
  return warnings[userId].count;
}

/**
 * الحصول على عدد تحذيرات عضو
 */
async function getWarningCount(userId) {
  const warnings = await loadWarnings();
  return warnings[userId]?.count || 0;
}

/**
 * مسح تحذيرات عضو
 */
async function clearWarnings(userId) {
  const warnings = await loadWarnings();
  delete warnings[userId];
  await saveWarnings(warnings);
}

/**
 * الحصول على تاريخ تحذيرات عضو
 */
async function getWarningHistory(userId) {
  const warnings = await loadWarnings();
  return warnings[userId]?.history || [];
}

module.exports = {
  addWarning,
  getWarningCount,
  clearWarnings,
  getWarningHistory,
};
