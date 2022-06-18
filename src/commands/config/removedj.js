const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = new CommandBuilder({
    name: "removedj",
    description: "Remove Dj Role",
    aliases: ["rdj"],
    permissions: {
        user: ['MANAGE_GUILD']
    },
    execute: async (client, message, args, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        if (data) {
            await data.delete()
            return message.reply({ embeds: [new MessageEmbed().setDescription(`Successfully Removed All DJ Roles.`).setColor(client.colors.default)] })
        } else return message.reply({ embeds: [new MessageEmbed().setDescription(`Don't Have Dj Setup In This Guild`).setColor(client.colors.default)] })

    }
});
