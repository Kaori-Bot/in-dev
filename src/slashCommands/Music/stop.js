const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "stop",
  description: "Stops the music",
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

    const autoplay = player.get("autoplay")
    if (autoplay === true) {
      player.set("autoplay", false);
    }

    player.stop();
    player.queue.clear();

    const emojistop = client.emoji.stop;

    let embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setTimestamp()
      .setDescription(`**${emojistop} |** Stopped the music`)
    return interaction.editReply({ embeds: [embed] });

  }
};
