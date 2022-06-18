const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "volume",
    aliases: ["v", "vol"],
    description: "Change volume of currently playing music",
    permissions: { onlyDj: true },
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true
    },
    async execute(client, message, args, prefix) {
        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
		}
		
		const volumeEmoji = client.emoji.volume_high;

		if (!args.length) {
			let embed = new MessageEmbed()
			.setColor(client.colors.default)
			.setTimestamp()
			.setDescription(`${volumeEmoji} The current volume is: **${player.volume}%**`)
			return message.reply({embeds: [embed]});
		}

		const volume = Number(args[0]);
		
		if (!volume || volume < 0 || volume > 100) { 
			let embed = new MessageEmbed()
                .setColor("RED")
				.setDescription(`Usage: ${prefix}volume <Number of volume between 0 - 100>`)
            return message.reply({embeds: [embed]});
		}

		player.setVolume(volume);

		if (volume > player.volume) {
			var emojivolume = client.emoji.volume_high;
			let embed = new MessageEmbed()
				.setColor(client.colors.default)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [embed]});
		} else if (volume < player.volume) {
			var emojivolume = message.client.emoji.volume_low;
			let embed = new MessageEmbed()
				.setColor(client.colors.default)
				.setTimestamp()
				.setDescription(`${emojivolume} Volume set to: **${volume}%**`)
		  return message.reply({embeds: [embed]});
		} else {
			let embed = new MessageEmbed()
				.setColor(client.colors.default)
				.setTimestamp()
				.setDescription(`${volumeEmoji} Volume set to: **${volume}%**`)
			return message.reply({embeds: [embed]});
		}
		
 	}
});
