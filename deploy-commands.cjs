const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".cjs"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log(`🔄 بدء تسجيل ${commands.length} أمر...`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log(`✅ تم تسجيل ${data.length} أمر بنجاح!`);
    
    data.forEach(cmd => {
      console.log(`   - /${cmd.name}`);
    });
  } catch (error) {
    console.error("❌ خطأ في تسجيل الأوامر:", error);
  }
})();
