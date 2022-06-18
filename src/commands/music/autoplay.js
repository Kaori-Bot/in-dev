const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "autoplay",
    description: "Toggle music autoplay",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {
        const player = message.client.manager.get(message.guild.id);

        const autoplay = player.get("autoplay");

        const emojireplay = client.emoji.autoplay;

        if (autoplay === false) {
            const identifier = player.queue.current.identifier;
            player.set("autoplay", true);
            player.set("requester", message.author);
            player.set("identifier", identifier);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            res = await player.search(search, message.author);
            player.queue.add(res.tracks[1]);
            let embed = new MessageEmbed()
                .setColor(client.colors.default)
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **enabled**`);
            return message.channel.send({ embeds: [embed] });
        } else {
            player.set("autoplay", false);
            player.queue.clear();
            let embed = new MessageEmbed()
                .setColor(client.colors.default)
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **disabled**`);

            return message.channel.send({ embeds: [embed] });
        }
    },
});
