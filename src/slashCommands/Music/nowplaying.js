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
          ephemeral: false,
          fetchReply: true
        });
         const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return interaction.editReply({embeds: [embed]});
        }

        const song = player.get('data:currentSong');
        const embed = new MessageEmbed()
            .setAuthor({ name: 'Now playing', iconURL: client.config.imageUrl.music })
            .setDescription(`[${song.title}](${song.uri}) by ${song.requester}`)
            .setThumbnail(song.displayThumbnail('hqdefault'))
            .setColor(client.colors.default)
            .addField("\u200b", `${parseDuration(player.position)} ${progressBar(player.position, song.duration).default} ${parseDuration(song.duration)}`);

         interaction.editReply({embeds: [embed]});
         return interaction.fetchReply().then(msg=>player.setMessage('nowPlaying', msg));
    }
};
