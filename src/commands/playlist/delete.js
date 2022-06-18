const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = new CommandBuilder({
    name: "delete",
    aliases: ["pldelete"],
    description: "Delete your saved playlist.",
    usage: "<playlist name>",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        await data.delete();
        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setDescription(`Successfully deleted ${Name} playlist`)
        return message.channel.send({ embeds: [embed] })
    }
});
