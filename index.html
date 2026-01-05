const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once("ready", () => {
  console.log(`ログイン完了: ${client.user.tag}`)
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "nowtime") {
    const now = new Date()
    const time = now.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo"
    })

    await interaction.reply(`🕒 今の時間は **${time}** です`)
  }
})

client.login(process.env.DISCORD_TOKEN)
