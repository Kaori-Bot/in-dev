const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "resume",
  description: "Resume currently playing music",
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
    const song = player.queue.current;

    if (!player.queue.current) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [embed] });
    }

    const emojiresume = client.emoji.resume;

    if (!player.paused) {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emojiresume} The player is already **resumed**.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [embed] });
    }

    player.pause(false);

    let embed = new MessageEmbed()
      .setDescription(`${emojiresume} **Resumed**\n[${song.title}](${song.uri})`)
      .setColor(client.colors.default)
      .setTimestamp()
    return interaction.editReply({ embeds: [embed] });

  }
};
