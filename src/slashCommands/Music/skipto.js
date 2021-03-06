const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "skipto",
  description: "Forward song",
  permissions: [],
  requiredPlaying: true,
  permissions: { onlyDj: true },
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "select a song number",
      required: true,
      type: "NUMBER"
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const args = interaction.options.getNumber("number");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return await interaction.editReply({ embeds: [embed] });
    }

    const position = Number(args);

    if (!position || position < 0 || position > player.queue.size) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`Usage: ${prefix}volume <Number of song in queue>`)
      return await interaction.editReply({ embeds: [embed] });
    }

    player.queue.remove(0, position - 1);
    player.stop();

    const emojijump = client.emoji.skip;

    let embed = new MessageEmbed()
      .setDescription(`${emojijump} Forward **${position}** Songs`)
      .setColor(client.colors.default)
      .setTimestamp()

    return await interaction.editReply({ embeds: [embed] });

  }
};
