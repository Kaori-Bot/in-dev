const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = new CommandBuilder({
    name: "invite",
    aliases: ["add"],
    description: "Send my invite link",
    execute: async (client, message, args, prefix) => {
        const actionRow = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setLabel("Add to Server")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`)
            ]);

            const mainPage = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, format: 'png' }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setColor(client.colors.default)
            .setDescription(`This is the link invite me to your server. [Add to Server](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)`);
        message.reply({embeds: [mainPage], components: [row]})
    }
});
