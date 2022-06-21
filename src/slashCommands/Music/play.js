const { CommandInteraction, Client, MessageEmbed, Permissions } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js');
module.exports = {
  name: "play",
  description: "To play some song.",
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "input",
      description: "The search input (name/url)",
      required: true,
      type: "STRING"
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction,) => {
    await interaction.deferReply({
      ephemeral: false
    });
    if (!interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
    const { channel } = interaction.member.voice;
    if (!interaction.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });

    const emojiaddsong = client.emoji.song_add;
    const emojiplaylist = client.emoji.playlist;
    let search = interaction.options.getString("input");
    let res;

    let player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member.voice.channelId,
      selfDeafen: true,
      volume: 100
    });

    if (player.state != "CONNECTED") await player.connect();

    try {
      res = await player.search(search);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new MessageEmbed().setColor(client.colors.default).setTimestamp().setDescription(`**${client.emoji.error} |** There was an error while searching!`)] });
      }
    } catch (err) {
      console.error(err);
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({ embeds: [new MessageEmbed().setColor(client.colors.default).setTimestamp().setDescription(`**${client.emoji.error} |** No results were found.`)] });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0], interaction.user);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new MessageEmbed()
          .setColor(client.colors.default)
          .setTimestamp()
          .setDescription(`${emojiplaylist} **Added song to queue** [${res.tracks[0].title}](${res.tracks[0].uri}) - \`[${parseDuration(res.tracks[0].duration)}]\``);
        return await interaction.editReply({ embeds: [trackload] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        await player.play();

        const playlistloadds = new MessageEmbed()
          .setColor(client.colors.default)
          .setTimestamp()
          .setDescription(`${emojiplaylist} **Playlist added to queue** [${res.playlist.name}](${search}) - \`[${parseDuration(res.playlist.duration)}]\``);
        return await interaction.editReply({ embeds: [playlistloadds] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length) {
          const searchresult = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail('hqdefault'))
            .setDescription(`${emojiplaylist} **Added song to queue** [${track.title}](${track.uri}) - \`[${parseDuration(track.duration)}]`);

          player.play();
          return await interaction.editReply({ embeds: [searchresult] });

        } else {
          const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail('hqdefault'))
            .setDescription(`${emojiplaylist} **Added song to queue** [${track.title}](${track.uri}) - \`[${parseDuration(track.duration)}]\``);

          return await interaction.editReply({ embeds: [embed] });

        }
    }
  }
}

