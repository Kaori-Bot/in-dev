const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "leave",
  description: "Leave voice channel",
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

    const player = client.manager.get(interaction.guildId);

    const emojiLeave = client.emoji.leave;

    player.destroy();

    let embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setDescription(`**${emojiLeave} |** Leaving the voice channel. Thank you for using my service!`);
    return interaction.editReply({ embeds: [embed] });

  }
};
