const { SlashCommandBuilder } = require("@discordjs/builders");
const ytSearch = require("yt-search");
const ytdl = require('ytdl-core');
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Youtube")
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song to be reproduced')
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(interaction.member.user.id);
    const voiceChannelId = member.voice.channelId;
    if(voiceChannelId == null){
      return interaction.reply({content:"You need to be in a voice channel to request a song",ephemeral:true})
    }
    const player = createAudioPlayer();
    player.on("error", (error) => {
      console.error("Error:", error.message);
    });
    let userQuery = interaction.options._hoistedOptions[0].value;
    let song = await songFinder(userQuery);
    if(ytdl.validateURL(song.url)){
      const stream = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));
      joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      }).subscribe(player);
      player.play(stream);
    }
    await interaction.reply({content:`You searched for ${song.title}!`,ephemeral:true});
  },
};


const songFinder = async (query) => {
  let songResult = await ytSearch(query);
  return (songResult.videos.length > 1) ? songResult.videos[0] : null;
}