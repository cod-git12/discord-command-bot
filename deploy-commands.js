const { REST, Routes, SlashCommandBuilder } = require("discord.js")

const commands = [
  new SlashCommandBuilder()
    .setName("nowtime")
    .setDescription("今の時間を表示します")
    .toJSON()
]

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
  try {
    console.log("コマンド登録中...")
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )
    console.log("登録完了！")
  } catch (error) {
    console.error(error)
  }
})()
