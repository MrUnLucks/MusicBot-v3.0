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
    //Create player and queue
    let player = new Player(interaction.client);
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });
    //Check vc connection
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
    //Load the queue and play
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `Track **${query}** not found!`,
      });

    queue.play(track);
  },
};
/*const { SlashCommandBuilder } = require("@discordjs/builders");
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
    var player = new Player(interaction.client);
    //Create the query and check if one already exists
    let queue = null;
    if (player.getQueue(interaction.guildId)) {
      queue = player.getQueue(interaction.guildId);
      console.log("get queue");
    } else {
      console.log("create queue");
      queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
      });
    }
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
    let message = "";
    await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => {
        message = `Found: **${x.tracks[0]}**`;
        //Add to queue
        queue.addTrack(x.tracks[0]);
        //Play the queue if it is the first song
      })
      //Track not found
      .catch(() => {
        message = `${query} not found`;
      });

    interaction.reply({
      content: message,
      ephemeral: true,
    });
    queue.play();
  },
};
 */
