const UPDATE_CHANNEL_ID = "1453677204301942826"

const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const startTime = Date.now()

client.once("ready", async () => {
  console.log(`ログイン完了: ${client.user.tag}`)

  try {
    const channel = await client.channels.fetch(UPDATE_CHANNEL_ID)
    if (channel && channel.isTextBased()) {
      await channel.send("📢 **アップデートが完了しました**\nアップデートの内容については https://discord.com/channels/1453664112973447311/1453677204301942826 をご覧ください")
    }
  } catch (e) {
    console.error("アップデート通知の送信に失敗:", e)
  }
})


client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return
  const name = interaction.commandName

  // ping
  if (name === "ping") {
    return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`)
  }

  // uptime（秒まで表示）
  if (name === "uptime") {
    const totalSec = Math.floor((Date.now() - startTime) / 1000)

    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60

    return interaction.reply(
      `⏱ このボットが起動してから ${h}時間${m}分${s}秒 が経過しています`
    )
  }


  // nowtime
  if (name === "nowtime") {
    const t = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    return interaction.reply(`🕒 今の時間は **${t}** です！`)
  }

  // nowdate（修正）
  if (name === "nowdate") {
    const d = new Date().toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long"
    })
    return interaction.reply(`📅 今日の日付は **${d}** です！`)
  }

  // dice
  if (name === "dice") {
    return interaction.reply(`🎲 ${Math.floor(Math.random() * 6) + 1}`)
  }

  // coin（修正）
  if (name === "coin") {
    const result = Math.random() < 0.5 ? "表" : "裏"
    return interaction.reply(`🪙 コイントスをしました。\n結果：**${result}**`)
  }

  // random（演出追加）
  if (name === "random") {
    const items = interaction.options.getString("items").split(" ")
    const pick = items[Math.floor(Math.random() * items.length)]

    const list = items.join("、")
    return interaction.reply(
      `🎯 **抽選開始**\n選択肢：${list}\n:dart: **抽選結果 ${pick}**`
    )
  }

  // calc
  if (name === "calc") {
    const f = interaction.options.getString("formula")
    if (!/^[0-9+\-*/(). ]+$/.test(f)) {
      return interaction.reply("❌ 使用できない式です")
    }
    try {
      const r = eval(f)
      return interaction.reply(`計算完了\n ${f} = **${r}**`)
    } catch {
      return interaction.reply("❌ 計算できません")
    }
  }

  // remind（拡張）
  if (name === "remind") {
    const time = interaction.options.getString("time")
    const text = interaction.options.getString("text")

    const match = time.match(/^(\d+(\.\d+)?)(s|m|h|d)$/)
    if (!match) {
      return interaction.reply("❌ 例: 10s / 0.1m / 2h / 1d")
    }

    const value = parseFloat(match[1])
    const unit = match[3]

    const unitMs = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000
    }

    const ms = value * unitMs[unit]

    await interaction.reply(`⏰ ${time}後に通知します`)

    setTimeout(() => {
      interaction.followUp(`🔔 ${interaction.user} ${text}`)
    }, ms)
  }

  // poll（仕様変更）
  if (name === "poll") {
    const parts = interaction.options.getString("content").split("|").map(s => s.trim())
    const title = parts.shift()

    await interaction.reply({
      content: "✅ 投票を作成しました",
      ephemeral: true
    })

    let msg =
      `📊 **${interaction.user.username} からの投票です**\n` +
      `**${title}**\n`

    parts.forEach((p, i) => {
      msg += `${i + 1}. ${p}\n`
    })

    const sent = await interaction.channel.send(msg)

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
    for (let i = 0; i < parts.length && i < emojis.length; i++) {
      await sent.react(emojis[i])
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
