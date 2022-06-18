const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "loop",
    aliases: ['repeat'],
    description: "Toggle music loop",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    permissions: {
        onlyDj: true
    },
    execute: async (client, message, args, prefix) => {

        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({ embeds: [embed] });
        }
        const emojiloop = message.client.emoji.loop;

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            let embed = new MessageEmbed()
                .setColor(client.colors.default)
                .setTimestamp()
                .setDescription(`${emojiloop} Loop queue is now **${queueRepeat}**`)
            return message.reply({ embeds: [embed] });
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        let embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
            .setDescription(`${emojiloop} Loop track is now **${trackRepeat}**`)
        return message.reply({ embeds: [embed] });
    }
});
