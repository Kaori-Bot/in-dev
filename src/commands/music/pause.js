const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "pause",
    description: "Pause the currently playing music",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    permissions: {
        onlyDj: true
    },
    async execute(client, message, args, prefix) {
     const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }

        const emojipause = client.emoji.pause;

        if (player.paused) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`**${emojipause} |** The player is already \`paused\`.`)
                .setTimestamp()
                return message.reply({embeds: [embed]});
        }

        player.pause(true);

        const song = player.queue.current;

        let embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
            .setDescription(`**${emojipause} | Paused** [${song.title}](${song.uri})`)
          return message.reply({embeds: [embed]}).then(msg=>player.setMessage('pause', msg));

    }
});
