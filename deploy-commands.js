const { REST, Routes, SlashCommandBuilder } = require("discord.js")

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botの応答速度を確認"),

  new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Botの稼働時間を表示"),

  new SlashCommandBuilder()
    .setName("nowtime")
    .setDescription("今の時間を表示"),

  new SlashCommandBuilder()
    .setName("nowdate")
    .setDescription("今日の日付を表示"),

  new SlashCommandBuilder()
    .setName("dice")
    .setDescription("サイコロを振る"),

  new SlashCommandBuilder()
    .setName("coin")
    .setDescription("コイントス"),

  new SlashCommandBuilder()
    .setName("random")
    .setDescription("候補からランダム選択")
    .addStringOption(o =>
      o.setName("items")
        .setDescription("スペース区切りで入力")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("calc")
    .setDescription("簡単な計算")
    .addStringOption(o =>
      o.setName("formula")
        .setDescription("例: 3*(5+2)")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("指定時間後にリマインド")
    .addStringOption(o =>
      o.setName("time")
        .setDescription("例: 10m / 1h")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text")
        .setDescription("内容")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("投票を作成")
    .addStringOption(o =>
      o.setName("content")
        .setDescription("例: 好きな色 | 赤 | 青")
        .setRequired(true)
    )
].map(c => c.toJSON())

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
  try {
    console.log("コマンド登録中...")
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )
    console.log("登録完了！")
  } catch (e) {
    console.error(e)
  }
})()
