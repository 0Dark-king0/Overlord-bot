# Overlord Discord Bot

## نظرة عامة
**Overlord** هو بوت Discord عربي سلطوي وذكي للإدارة والمراقبة، يستخدم Gemini AI للردود الرسمية.

## البنية التقنية

### المكتبات الأساسية:
- **discord.js v14** - للتفاعل مع Discord API
- **@google/genai** - للتكامل مع Gemini AI
- **ms** - لتحويل صيغ الوقت

### هيكل المشروع:
```
├── index.cjs              # الملف الرئيسي (CommonJS)
├── deploy-commands.cjs    # تسجيل الأوامر
├── config.json            # الإعدادات
├── commands/              # الأوامر العربية (*.cjs)
│   ├── مسح.cjs
│   ├── طرد.cjs
│   ├── حظر.cjs
│   ├── كتم.cjs
│   ├── فك_الكتم.cjs
│   └── تشغيل.cjs
├── events/                # معالجات الأحداث (*.cjs)
│   ├── ready.cjs
│   ├── messageCreate.cjs
│   └── interactionCreate.cjs
├── utils/                 # أدوات مساعدة (*.cjs)
│   ├── aiReply.cjs
│   ├── permissionCheck.cjs
│   └── warningSystem.cjs
└── data/
    └── warnings.json      # تخزين التحذيرات
```

**ملاحظة:** جميع ملفات البوت بصيغة `.cjs` (CommonJS) لأن package.json الرئيسي بصيغة ESM.

## المفاتيح المطلوبة
في Replit Secrets:
- `DISCORD_BOT_TOKEN`
- `DISCORD_CLIENT_ID`
- `GEMINI_API_KEY`

## التشغيل

### المتطلبات الأولية:
1. تفعيل **Message Content Intent** و **Server Members Intent** في Discord Developer Portal
2. إعداد المتغيرات البيئية في Replit Secrets

### تسجيل الأوامر (مرة واحدة):
```bash
node deploy-commands.cjs
```

### تشغيل البوت:
```bash
node index.cjs
```

## الميزات الرئيسية

### 1. الأوامر الإدارية
جميع الأوامر بالعربية مع slash commands

### 2. المراقبة التلقائية
- رصد الكلمات المسيئة
- حذف فوري
- نظام تحذيرات تراكمي
- كتم تلقائي عند التجاوز

### 3. الذكاء الاصطناعي
- ردود رسمية بالعربية عبر Gemini
- أسلوب سلطوي هادئ
- رد تلقائي عند المنشن

### 4. نظام السجلات
- قناة `overlord-logs` تُنشأ تلقائياً
- تسجيل جميع الإجراءات
- تتبع المخالفات

## الهوية
- **الطابع**: سلطوي، رسمي، هادئ
- **اللغة**: عربية فصحى حصرياً
- **الأسلوب**: مدير خفي يفرض النظام بهدوء

## التطوير المستقبلي
- لوحة تحكم ويب للإحصائيات
- أوامر متقدمة (تحذير يدوي، سجل العضو)
- نظام الأدوار التلقائية
- ترحيب مخصص للأعضاء الجدد

---

آخر تحديث: أكتوبر 2025
