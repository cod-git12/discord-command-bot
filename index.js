const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const startTime = Date.now()

client.once("ready", () => {
  console.log(`ログイン完了: ${client.user.tag}`)
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return

  const name = interaction.commandName

  // ping
  if (name === "ping") {
    return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`)
  }

  // uptime
  if (name === "uptime") {
    const sec = Math.floor((Date.now() - startTime) / 1000)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    return interaction.reply(`⏱ 起動してから ${h}時間${m}分`)
  }

  // nowtime
  if (name === "nowtime") {
    const t = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    return interaction.reply(`🕒 今の時間は **${t}**`)
  }

  // nowdate
  if (name === "nowdate") {
    const d = new Date().toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      weekday: "short"
    })
    return interaction.reply(`📅 今日の日付は **${d}**`)
  }

  // dice
  if (name === "dice") {
    return interaction.reply(`🎲 ${Math.floor(Math.random() * 6) + 1}`)
  }

  // coin
  if (name === "coin") {
    return interaction.reply(`🪙 ${Math.random() < 0.5 ? "表" : "裏"}`)
  }

  // random
  if (name === "random") {
    const items = interaction.options.getString("items").split(" ")
    const pick = items[Math.floor(Math.random() * items.length)]
    return interaction.reply(`🎯 ${pick}`)
  }

  // calc（超簡易・eval注意済み）
  if (name === "calc") {
    const f = interaction.options.getString("formula")
    if (!/^[0-9+\-*/(). ]+$/.test(f)) {
      return interaction.reply("❌ 使用できない式です")
    }
    try {
      const r = eval(f)
      return interaction.reply(`🧮 ${f} = **${r}**`)
    } catch {
      return interaction.reply("❌ 計算できません")
    }
  }

  // remind
  if (name === "remind") {
    const time = interaction.options.getString("time")
    const text = interaction.options.getString("text")

    const match = time.match(/^(\d+)(m|h)$/)
    if (!match) {
      return interaction.reply("❌ 時間は 10m、1h の形式で入力してください")
    }

    const ms = match[1] * (match[2] === "h" ? 3600000 : 60000)
    await interaction.reply(`⏰ ${time}後に通知します`)

    setTimeout(() => {
      interaction.followUp(`🔔 ${interaction.user} ${text}`)
    }, ms)
  }

  // poll
  if (name === "poll") {
    const parts = interaction.options.getString("content").split("|").map(s => s.trim())
    const title = parts.shift()

    let msg = `📊 **${title}**\n`
    parts.forEach((p, i) => {
      msg += `${i + 1}. ${p}\n`
    })

    const sent = await interaction.reply({ content: msg, fetchReply: true })
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
    for (let i = 0; i < parts.length && i < emojis.length; i++) {
      await sent.react(emojis[i])
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
