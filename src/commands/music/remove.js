const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "remove",
    description: "Remove song from the queue",
    args: true,
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

        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [thing]});
        }

    const position = (Number(args[0]) - 1);
       if (position > player.queue.size) {
        const number = (position + 1);
         let thing = new MessageEmbed()
            .setColor("RED")
            .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return message.reply({embeds: [thing]});
        }

    const song = player.queue[position]
		player.queue.remove(position);

		const emojieject = client.emoji.remove;

		let thing = new MessageEmbed()
			.setColor(client.colors.default)
			.setTimestamp()
			.setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
		  return message.reply({embeds: [thing]});
	
    }
});