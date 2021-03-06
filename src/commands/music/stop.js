const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "stop",
    description: "Stops the music",
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

        const autoplay = player.get("autoplay")
        if (autoplay === true) {
            player.set("autoplay", false);
        }

        player.stop();
        player.queue.clear();

        const emojistop = client.emoji.stop;

		    let embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
            .setDescription(`**${emojistop} |** Stopped the music`)
        message.reply({embeds: [embed]});
	
  	}
});
