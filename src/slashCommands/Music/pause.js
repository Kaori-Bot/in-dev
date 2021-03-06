const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  permissions: [],
  permissions: { onlyDj: true },
  requiredPlaying: true,
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

    const emojipause = client.emoji.pause;

    if (player.paused) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emojipause} The player is already paused.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [embed] });
    }

    player.pause(true);

    const song = player.queue.current;

    let embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setTimestamp()
      .setDescription(`**${emojipause} | Paused** [${song.title}](${song.uri})`)
    return interaction.editReply({ embeds: [embed] });

  }
};
