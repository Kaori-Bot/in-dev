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
    execute: async (client, message, args, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);
        const song = player.queue.current

        let embed = new MessageEmbed()
            .setAuthor({ name: 'Now playing', iconURL: client.config.imageUrl.music })
            .setDescription(`[${song.title}](${song.uri}) by [${song.requester}]`)
            .setThumbnail(song.displayThumbnail('hqdefault'))
            .setColor(client.colors.default)
            .addField("\u200b", `\`${parseDuration(player.position)} ${progressBar(player).default} ${parseDuration(song.duration)}\``);
        return message.channel.send({embeds: [embed]})
    }
});
