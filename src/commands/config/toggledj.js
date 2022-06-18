const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = new CommandBuilder({
    name: "toggledj",
    description: "Toggle Dj mode",
    aliases: ["tgdj"],
    permissions: {
        user: ['MANAGE_GUILD'],
    },
    execute: async (client, message, args, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });

        if(!data) return message.reply({embeds:[new MessageEmbed().setDescription(`Don't Have Dj Setup In This Guild`).setColor(client.colors.default)]})

        let mode = false;
        if(!data.Mode)mode = true;
        data.Mode = mode;
        await data.save();
        if(mode) {
            await message.reply({embeds: [new MessageEmbed().setDescription(`Enabled DJ Mode.`).setColor(client.colors.default)]})
        } else {
           return await message.reply({embeds: [new MessageEmbed().setDescription(`Disabled DJ Mode.`).setColor(client.colors.default)]})
        }
    }
});
