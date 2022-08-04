const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Youtube"),
  async execute(interaction) {
    await interaction.reply("test!");
  },
};
