const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove song from the queue",
  permissions: [],
  requiredPlaying: true,
  permissions: { onlyDj: true },
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Number of song in queue",
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

    const position = (Number(args) - 1);
    if (position > player.queue.size) {
      const number = (position + 1);
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
      return await interaction.editReply({ embeds: [embed] });
    }

    const song = player.queue[position]
    player.queue.remove(position);

    const emojieject = client.emoji.remove;

    let embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setTimestamp()
      .setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
    return await interaction.editReply({ embeds: [embed] });

  }
};
