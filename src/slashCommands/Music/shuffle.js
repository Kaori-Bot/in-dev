const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "shuffle",
  description: "Shuffle queue",
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

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [embed] });
    }
    player.queue.shuffle();

    const emojishuffle = client.emoji.shuffle;

    let embed = new MessageEmbed()
      .setDescription(`${emojishuffle} Shuffled the queue`)
      .setColor(client.colors.default)
      .setTimestamp()
    return interaction.editReply({ embeds: [embed] });

  }
};
