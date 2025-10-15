// DON'T DELETE THIS COMMENT
// Using Gemini AI integration blueprint for formal Arabic responses
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * توليد رد رسمي بالعربية باستخدام Gemini
 * @param {string} context - السياق أو الموقف
 * @returns {Promise<string>} - الرد الرسمي
 */
async function generateFormalReply(context) {
  try {
    const systemPrompt = `أنت Overlord - بوت إدارة ديسكورد عربي سلطوي وهادئ.
- تتحدث بالعربية الفصحى فقط
- أسلوبك: رسمي، هادئ، سلطوي، واثق
- تستخدم جمل قصيرة ومباشرة
- لا تستخدم تهديدات أو صراخ، فقط حزم ووضوح
- لا تستخدم رموز تعبيرية (emoji) أبداً
- مبدؤك: "النظام فوق الجميع"

أمثلة على أسلوبك:
- "تم تنفيذ الأمر بنجاح."
- "المخالفة سُجلت."
- "الرجاء الالتزام بالقوانين."
- "المراقبة لا تتوقف."`;

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(context);
    const text = result.response.text();
    
    return text || "تم تنفيذ الإجراء.";
  } catch (error) {
    console.error("Error generating AI reply:", error);
    return "تم تسجيل الحدث.";
  }
}

/**
 * توليد رد للتحذير
 */
async function generateWarningReply(reason, warningCount) {
  const context = `تم حذف رسالة عضو بسبب: ${reason}. هذا التحذير رقم ${warningCount}. اكتب رداً رسمياً قصيراً (جملة واحدة).`;
  return await generateFormalReply(context);
}

/**
 * توليد رد عند المنشن
 */
async function generateMentionReply(message) {
  const context = `أحد الأعضاء منشنك في رسالة تقول: "${message}". اكتب رداً رسمياً هادئاً (جملة واحدة أو جملتين).`;
  return await generateFormalReply(context);
}

module.exports = {
  generateFormalReply,
  generateWarningReply,
  generateMentionReply,
};
