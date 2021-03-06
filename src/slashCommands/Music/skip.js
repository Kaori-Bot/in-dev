const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  description: "To skip a song/track from the queue.",
  permissions: [],
  requiredPlaying: true,
  permissions: { onlyDj: true },
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const emojiskip = client.emoji.skip;
    const player = client.manager.get(interaction.guildId);

    if (player && player.state !== "CONNECTED") {
      player.destroy();
      return await interaction.editReply({
        embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`Nothing is playing right now.`)]
      }).catch(() => { });
    };
    if (!player.queue) return await interaction.editReply({
      embeds: [new MessageEmbed().setColor(client.colors.default).setDescription("Nothing is playing right now.")]
    }).catch(() => { });
    if (!player.queue.current) return await interaction.editReply({
      embeds: [new MessageEmbed().setColor(client.colors.default).setDescription("Nothing is playing right now.")]
    }).catch(() => { });

    if (!player.queue.size) return await interaction.editReply({
      embeds: [new MessageEmbed().setColor(client.colors.default).setDescription("No songs left in the queue to skip.")]
    }).catch(() => { });

    player.stop();
    return await interaction.editReply({
      embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`**${emojiskip} | Skipped** [${player.queue.current.title}](${player.queue.current.uri})`)]
    }).catch(() => { });
  }
}
