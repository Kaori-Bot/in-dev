const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = new CommandBuilder({
    name: "join",
    description: "Join voice channel",
    inVoiceChannel: true,
    execute: async (client, message, args, prefix) => {

        let player = message.client.manager.get(message.guildId);
        if(player && player.voiceChannel && player.state === "CONNECTED") {
            return await message.channel.send({embeds: [new MessageEmbed().setColor(client.colors.default).setDescription( `I'm already connected to <#${player.voiceChannel}> voice channel!`)]})
        }
        else {
            if (!message.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)]});

            const { channel } = message.member.voice;
            if (!message.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)]});

            const emojiJoin = message.client.emoji.join;
            player = message.client.manager.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                volume: 100,
                selfDeafen: true,
            }) 
            if(player && player.state !== "CONNECTED") player.connect();

            let thing = new MessageEmbed()
                .setColor(client.colors.default)
                .setDescription(`${emojiJoin} **Join the voice channel**\nJoined <#${channel.id}> and bound to <#${message.channel.id}>`)
            return message.reply({ embeds: [thing] });

        };
    }
});