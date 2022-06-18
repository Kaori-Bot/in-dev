const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js')
const ms = require('ms');

module.exports = new CommandBuilder({
  	name: "seek",
  	description: "Seek the currently playing song",
  	args: true,
    usage: "<10s || 10m || 10h>",
    permissions: { onlyDj: true },
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {
  
		const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.reply({embeds: [embed]});
        }

        const time = ms(args[0])
        const position = player.position;
        const duration = player.queue.current.duration;

        const emojiforward = client.emoji.forward;
        const emojirewind = client.emoji.rewind;

        const song = player.queue.current;
        
        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let embed = new MessageEmbed()
                    .setDescription(`${emojiforward} **Forward**\n[${song.title}](${song.uri})\n\`${parseDuration(time)} / ${parseDuration(duration)}\``)
                    .setColor(client.colors.default)
                    .setTimestamp()
                return message.reply({embeds: [embed]});
            } else {
                player.seek(time);
                let embed = new MessageEmbed()
                    .setDescription(`${emojirewind} **Rewind**\n[${song.title}](${song.uri})\n\`${parseDuration(time)} / ${parseDuration(duration)}\``)
                    .setColor(client.colors.default)
                    .setTimestamp()
          return message.reply({embeds: [embed]});
            }
        } else {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${parseDuration(duration)}\``);
            return message.reply({embeds: [embed]});
        }
	
    }
});
