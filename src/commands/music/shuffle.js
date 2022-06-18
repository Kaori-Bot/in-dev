const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
  	name: "shuffle",
    description: "Shuffle queue",
    permissions: { onlyDj: true },
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {
        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }
        player.queue.shuffle();
        
        const emojishuffle = client.emoji.shuffle;

        let embed = new MessageEmbed()
            .setDescription(`${emojishuffle} Shuffled the queue`)
            .setColor(client.colors.default)
            .setTimestamp()
        return message.reply({embeds: [embed]}).catch(error => client.logger.log(error, "error"));
    }
});
