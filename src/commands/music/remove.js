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
    async execute(client, message, args, prefix) {

        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }

    const position = (Number(args[0]) - 1);
       if (position > player.queue.size) {
        const number = (position + 1);
         let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return message.reply({embeds: [embed]});
        }

    const song = player.queue[position]
		player.queue.remove(position);

		const emojieject = client.emoji.remove;

		let embed = new MessageEmbed()
			.setColor(client.colors.default)
			.setTimestamp()
			.setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
		  return message.reply({embeds: [embed]});
	
    }
});
