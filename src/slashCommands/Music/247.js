const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "247",
  description: "24/7 in voice channel",
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
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new MessageEmbed()
        .setDescription("24/7 mode is **disabled**")
        .setColor(client.colors.default)
      return interaction.editReply({ embeds: [embed] });
    } else {
      player.twentyFourSeven = true;
      const embed = new MessageEmbed()
        .setDescription("24/7 mode is **Enable**")
        .setColor(client.colors.default)
      return interaction.editReply({ embeds: [embed] });

    }
  }
}
