const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutup")
    .setDescription("Mute'em all!"),
  async execute(interaction) {
    const guild = interaction.guild;
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channelId;
    const connection = joinVoiceChannel({
      channelId: voiceChannel,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    })
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
      connection.receiver.speaking.on("start", (userId) => {
        let memberToMute = guild.members.cache.get(userId);
        setTimeout(() => memberToMute.voice.setMute(), 500);
      });
    } catch (error) {
      console.warn(error);
    }
    interaction.reply({ephemeral:true,content:"Now muting all members that try to speak..."})
  },
};
