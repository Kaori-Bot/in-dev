const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");

module.exports = new CommandBuilder({
    name: "247",
    aliases: ["24/7","24h"],
    description: "24/7 in voice channel",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {

        const player = message.client.manager.players.get(message.guild.id);
        if (player.twentyFourSeven) {
            player.twentyFourSeven = false;
            const embed = new MessageEmbed()
                .setColor(client.colors.default)
                .setDescription(`24/7 mode is now off.`);

            return message.reply({embeds: [embed]});
        }
        else {
            player.twentyFourSeven = true;
            const embed = new MessageEmbed()
                .setColor(client.colors.default)
                .setDescription(`24/7 mode is now on.`)

            return message.reply({embeds: [embed]});
        }
    }
});
