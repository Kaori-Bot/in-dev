const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
const parseDuration = require('../../utils/parseDuration.js');
const progressBar = require('../../utils/progressBar.js')

module.exports = {
    name: "nowplaying",
    description: "Show now playing song",
    permissions: [],
    requiredPlaying: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
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
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return interaction.editReply({embeds: [thing]});
        }

        const song = player.queue.current
        const emojimusic = client.emoji.music;
        var total = song.duration;
        var current = player.position;

        let embed = new MessageEmbed()
            .setDescription(`${emojimusic} **Now Playing**\n[${song.title}](${song.uri}) - \`[${parseDuration(song.duration)}]\`- [${song.requester}] \n\n\`${progressBar.default(player)}\``)
            .setThumbnail(song.displayThumbnail('hqdefault'))
            .setColor(client.colors.default)
            .addField("\u200b", `\`${parseDuration(current)} / ${parseDuration(total)}\``)
         return interaction.editReply({embeds: [embed]})
            
    }
};
