const { SlashCommandBuilder } = require("@discordjs/builders");
const { Player } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Youtube")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song to be reproduced")
        .setRequired(true)
    ),
  async execute(interaction) {
    const player = new Player(interaction.client);
    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    const voiceChannelId = member.voice.channelId;
    if (voiceChannelId == null) {
      return await interaction.reply({
        content: "You need to be in a voice channel to request a song",
        ephemeral: true,
      });
    }
    //Create the query and check if one already exists
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      });
    }
    //Read the user query
    const query = interaction.options.get("song").value;
    //Search the track
    let track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => {
        interaction.reply({ content: `Now playing **${x.tracks[0]}**` });
        return x.tracks[0];
      });
    //Track not found
    if (!track) {
      return await interaction.followUp({
        content: `❌ | Track **${query}** not found!`,
      });
    }
    try {
      queue.addTrack(track);
    } catch (e) {
      console.error(e);
    }
    if (!queue.playing) await queue.play();
  },
};
