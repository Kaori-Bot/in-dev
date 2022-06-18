const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/dj");

module.exports = new CommandBuilder({
    name: "adddj",
    description: "Set Dj Role",
    aliases: ["adj"],
    permissions: {
        user: ['MANAGE_GUILD']
    },
    async execute(client, message, args, prefix) {

        let data = await db.findOne({ Guild: message.guild.id });
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply({ embeds: [new MessageEmbed().setDescription(`Please add a Role via ping, @role!`).setColor(client.colors.default)] })
        if (!data) {
           data = new db({
                Guild: message.guild.id,
                Roles: [role.id],
                Mode: true
            })
            await data.save();
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(`Successfully Added DJ Role ${role}.`).setColor(client.colors.default)] })
        } else {
            let rolecheck = data.Roles.find((x) => x === role.id);
            if (rolecheck) return message.reply({ embeds: [new MessageEmbed().setDescription(`Role Already Exists in List.`).setColor(client.colors.default)] })
            data.Roles.push(role.id);
            await data.save();
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(`Successfully Added New DJ Role ${role}.`).setColor(client.colors.default)] })

        }
    }
});
