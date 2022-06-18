const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js');

module.exports = new CommandBuilder({
    name: "grab",
    aliases: ["save"],
    description: "Grabs And Sends You The Song That Is Playing At The Moment",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
            .setColor("#FFC942")
            .setDescription("> There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const song = player.queue.current
        const total = song.duration;
        const current = player.position;

        const dmbut = new MessageButton().setLabel("Check Your Dm").setStyle("LINK").setURL(`https://discord.com/users/${client.id}`)
        const row = new MessageActionRow().addComponents(dmbut)

        let dm = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL()})
        .setDescription(`:mailbox_with_mail: \`Check Your Dms!\``)
        .setColor(client.colors.default)
        .setFooter({text: `Requested By ${message.author.tag}`})
        .setTimestamp()
        message.reply({embeds: [dm], components: [row]})
        
        const urlbutt = new MessageButton().setLabel("Search").setStyle("LINK").setURL(song.uri)
        const row2 = new MessageActionRow().addComponents(urlbutt)
        let embed = new MessageEmbed()
            .setDescription(`**Song Details** \n\n > **__Song Name__**: [${song.title}](${song.uri}) \n > **__Song Duration__**: \`[${parseDuration(song.duration)}]\` \n > **__Song Played By__**: [<@${song.requester.id}>] \n > **__Song Saved By__**: [<@${message.author.id}>]`)
            .setThumbnail(song.displayThumbnail())
            .setColor(client.colors.default)
            .addField("\u200b", `\`${parseDuration(current)} / ${parseDuration(total)}\``)
         return message.author.send({embeds: [embed], components: [row2]})
            
    }
});
