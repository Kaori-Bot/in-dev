const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "resume",
    description: "Resume currently playing music",
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
        const song = player.queue.current;

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }

        const emojiresume = client.emoji.resume;

        if (!player.paused) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`**${emojiresume} |** The player is already **\`resumed\`**.`)
                .setTimestamp()
          return message.reply({embeds: [embed]});
        }

        player.pause(false);
        player.setMessage('pause');

        let embed = new MessageEmbed()
            .setDescription(`**${emojiresume} Resumed** [${song.title}](${song.uri})`)
            .setColor(client.colors.default)
            .setTimestamp()
        return message.reply({embeds: [embed]}).then(msg => setTimeout(() => msg.delete(), 10000));
	
    }
});
