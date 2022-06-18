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

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
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
            return message.channel.send({embeds: [embed]})

    }
});
