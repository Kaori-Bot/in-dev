const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js');
const progressBar = require('../../utils/progressBar.js')

module.exports = new CommandBuilder({
    name: "nowplaying",
    aliases: ["np"],
    description: "Show now playing song",
    options: {
        requiredPlaying: true,
    },
    async execute(client, message, args, prefix) {
  
        const player = message.client.manager.get(message.guild.id);
        const song = player.get('data:currentSong');
        const embed = new MessageEmbed()
            .setAuthor({ name: 'Now playing', iconURL: client.config.imageUrl.music })
            .setDescription(`[${song.title}](${song.uri}) by ${song.requester}`)
            .setThumbnail(song.displayThumbnail('hqdefault'))
            .setColor(client.colors.default)
            .addField("\u200b", `${parseDuration(player.position)} ${progressBar(player.position, song.duration).default} ${parseDuration(song.duration)}`);

        return message.channel.send({embeds: [embed]}).then(msg=>player.setMessage('nowPlaying', msg));
    }
});
