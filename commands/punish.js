const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punish")
    .setDescription("Miller saying \'Punizione Esemplare\'"),
  async execute(interaction) {
    const guild = interaction.guild;
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channelId;
    
    const player = createAudioPlayer();
    player.on("error", (error) => {
      console.error("Error:", error.message);
    });
    let resource = createAudioResource(
      require("path").join(__dirname, "../punizioneEsemplare.mp3")
    );
    joinVoiceChannel({
      channelId: voiceChannel,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    }).subscribe(player);
    player.play(resource);
    interaction.reply({ephemeral:true,content:"Silence! Miller is speaking!"})
  },
};
