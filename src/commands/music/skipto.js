const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "skipto",
    aliases: ["jump"],
    description: "Forward song",
    args: true,
    usage: "<Number of song in queue>",
    permissions: { onlyDj: true },
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {
        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }

        const position = Number(args[0]);
		
		if (!position || position < 0 || position > player.queue.size) { 
			let embed = new MessageEmbed()
                .setColor("RED")
				.setDescription(`Usage: ${message.client.config.prefix}skipto <Number of song in queue>`)
            return message.reply({embeds: [embed]});
		}

        player.queue.remove(0, position - 1);
        player.stop();
		
		const emojijump = client.emoji.skip;

		let embed = new MessageEmbed()
			.setDescription(`${emojijump} Forward **${position}** Songs`)
			.setColor(client.colors.default)
			.setTimestamp()
			
		return message.reply({embeds: [embed]});
	
    }
});
