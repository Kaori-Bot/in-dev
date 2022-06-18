const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "leave",
    aliases: ["dc"],
    description: "Leave voice channel",
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

        const emojiLeave = message.client.emoji.leave;

        player.destroy();
        let embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setDescription(`**${emojiLeave} |** Leaving the voice channel. Thank you for using my service!`);
          return message.reply({embeds: [embed]});

    }
});
