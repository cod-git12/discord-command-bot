require("dotenv").config()
const { Client, GatewayIntentBits } = require("discord.js")

/* ===== 設定 ===== */
const UPDATE_CHANNEL_ID = "1453677204301942826"

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const startTime = Date.now()

/* ===== 稼働時間計算 ===== */
function getUptime() {
  const sec = Math.floor((Date.now() - startTime) / 1000)
  return {
    d: Math.floor(sec / 86400),
    h: Math.floor((sec % 86400) / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60
  }
}

/* ===== status Embed ===== */
function createStatusEmbed() {
  const { d, h, m, s } = getUptime()
  return {
    color: 0x5865f2,
    title: "🟢 Bot Status",
    fields: [
      { name: "稼働時間", value: `${d}日 ${h}時間 ${m}分 ${s}秒` },
      { name: "Ping", value: `${client.ws.ping} ms`, inline: true },
      { name: "サーバー数", value: `${client.guilds.cache.size}`, inline: true }
    ],
    timestamp: new Date()
  }
}

/* ===== 起動時 ===== */
client.once("ready", async () => {
  console.log(`✅ ログイン完了: ${client.user.tag}`)

  try {
    const channel = await client.channels.fetch(UPDATE_CHANNEL_ID)
    if (channel && channel.isTextBased()) {
      await channel.send({
        content:
          "📢 **アップデートが完了しました**\n" +
          "詳細: https://discord.com/channels/1453664112973447311/1459489280857477140",
//        embeds: [createStatusEmbed()]
      })
    }
  } catch (e) {
    console.error("アップデート通知の送信に失敗:", e)
  }
})

/* ===== コマンド処理 ===== */
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return
  const name = interaction.commandName

  /* ping */
  if (name === "ping") {
    return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`)
  }

  /* uptime（Embed・日＋秒） */
  if (name === "uptime") {
    const { d, h, m, s } = getUptime()
    return interaction.reply({
      embeds: [{
        color: 0x00ff99,
        title: "⏱ Bot Uptime",
        description: `${d}日 ${h}時間 ${m}分 ${s}秒`,
        timestamp: new Date()
      }]
    })
  }

  /* status */
  if (name === "status") {
    return interaction.reply({
      embeds: [createStatusEmbed()]
    })
  }

  /* help（みんなに表示） */
  if (name === "help") {
    return interaction.reply({
      embeds: [{
        color: 0x57f287,
        title: "📘 コマンド一覧",
        fields: [
          {
            name: "⏰ 時間系",
            value:
              "`/nowtime`\n" +
              "`/nowdate`\n" +
              "`/uptime`\n" +
              "`/status`\n" +
              "`/ping`"
          },
          {
            name: "🎲 ユーティリティ",
            value:
              "`/dice`\n" +
              "`/coin`\n" +
              "`/random`\n" +
              "`/calc`\n" +
              "`/remind`\n" +
              "`/poll`"
          }
        ],
        footer: { text: "Bloxd 攻略 Wiki Bot" }
      }]
    })
  }

  /* nowtime */
  if (name === "nowtime") {
    const t = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    return interaction.reply(`🕒 今の時間は **${t}** です`)
  }

  /* nowdate */
  if (name === "nowdate") {
    const d = new Date().toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long"
    })
    return interaction.reply(`📅 今日の日付は **${d}** です`)
  }

  /* dice */
  if (name === "dice") {
    return interaction.reply(`🎲 ${Math.floor(Math.random() * 6) + 1}`)
  }

  /* coin */
  if (name === "coin") {
    const r = Math.random() < 0.5 ? "表" : "裏"
    return interaction.reply(`🪙 コイントスをしました。\n結果：**${r}**`)
  }

  /* random */
  if (name === "random") {
    const items = interaction.options.getString("items").split(" ")
    const pick = items[Math.floor(Math.random() * items.length)]
    return interaction.reply(
      `🎯 **抽選開始**\n` +
      `選択肢：${items.join("、")}\n\n` +
      `:dart: **抽選結果：${pick}**`
    )
  }

  /* calc */
  if (name === "calc") {
    const f = interaction.options.getString("formula")
    if (!/^[0-9+\-*/(). ]+$/.test(f))
      return interaction.reply("❌ 使用できない式です")
    try {
      return interaction.reply(`🧮 ${f} = **${eval(f)}**`)
    } catch {
      return interaction.reply("❌ 計算できません")
    }
  }

  /* remind（s/m/h/d 対応） */
  if (name === "remind") {
    const time = interaction.options.getString("time")
    const text = interaction.options.getString("text")

    const match = time.match(/^(\d+(\.\d+)?)(s|m|h|d)$/)
    if (!match)
      return interaction.reply("❌ 例: 10s / 0.1m / 2h / 1d")

    const value = parseFloat(match[1])
    const unit = match[3]
    const ms =
      value * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit]

    await interaction.reply(`⏰ ${time}後に通知します`)
    setTimeout(() => {
      interaction.followUp(`🔔 ${interaction.user} ${text}`)
    }, ms)
  }

  /* poll */
  if (name === "poll") {
    const parts = interaction.options
      .getString("content")
      .split("|")
      .map(s => s.trim())

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

client.login(process.env.CMBOT_DISCORD_TOKEN)


