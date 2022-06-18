const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "skip",
    aliases: ["s"],
    description: "Skip the currently playing song",
    permissions: { onlyDj: true },
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
         return message.reply({embeds: [embed]});
        }
        const song = player.queue.current;
        player.stop();
		const emojiskip = message.client.emoji.skip;

		let embed = new MessageEmbed()
			.setDescription(`**${emojiskip} | Skipped** [${song.title}](${song.uri})`)
			.setColor(client.colors.default)
			.setTimestamp()
		return message.reply({embeds: [embed]}).then(msg =>  setTimeout(() => msg.delete(), 5000)
       )
    }
});
