const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "clearqueue",
    aliases: ["cq"],
    description: "Clear Queue",
    usage: "<Number of song in queue>",
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
            return message.reply({embeds: [embed]});
        }

		player.queue.clear();

		const emojieject = message.client.emoji.remove;

		let embed = new MessageEmbed()
			.setColor(client.colors.default)
			.setTimestamp()
			.setDescription(`${emojieject} Removed all songs from the queue`)
			  return message.reply({embeds: [embed]});
    }
});
