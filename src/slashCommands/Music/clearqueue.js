const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "clearqueue",
  description: "Clear Queue",
  permissions: [],
  requiredPlaying: true,
  permissions: { onlyDj: true },
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let player = interaction.client.manager.get(interaction.guildId);
    player.queue.clear();

    const emojieject = client.emoji.remove;

    let embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setTimestamp()
      .setDescription(`${emojieject} Removed all songs from the queue`)
    return interaction.editReply({ embeds: [embed] });

  }
};
