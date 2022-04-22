const { SlashCommandBuilder } = require("@discordjs/builders");
const ytSearch = require("yt-search");
const ytdl = require('ytdl-core')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Youtube")
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song to be reproduced')
        .setRequired(true)),
  async execute(interaction) {
    let userQuery = interaction.options._hoistedOptions[0].value;
    let song = await songFinder(userQuery);
    await interaction.reply(`You searched for ${song.title}!`);
  },
};


const songFinder = async (query) => {
  let songResult = await ytSearch(query);
  return (songResult.videos.length > 1) ? songResult.videos[0] : null;
}