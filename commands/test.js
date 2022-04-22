const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Mute'em all with Miller support!"),
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
    const connection = joinVoiceChannel({
      channelId: voiceChannel,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    }).subscribe(player)
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
      connection.receiver.speaking.on("start", (userId) => {
        let memberToMute = guild.members.cache.get(userId);
        setTimeout(() => memberToMute.voice.setMute(), 2000);
      });
    } catch (error) {
      console.warn(error);
    }
  },
};
