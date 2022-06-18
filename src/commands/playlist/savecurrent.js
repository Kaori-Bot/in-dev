const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = new CommandBuilder({
    name: "savecurrent",
    aliases: ["plsavec"],
    description: "Add current playing song in your saved playlist.",
    usage: "<playlist name>",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        const player = client.manager.players.get(message.guild.id);
        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(i18n.__("player.nomusic"));
            return message.reply({ embeds: [embed] });
        }
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        const track = player.queue.current;
        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        oldSong.push({
            "title": track.title,
            "uri": track.uri,
            "author": track.author,
            "duration": track.duration
        });
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $push: {
                    Playlist: {
                        title: track.title,
                        uri: track.uri,
                        author: track.author,
                        duration: track.duration
                    }

                }
            });
        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setDescription(`Added [${track.title.substr(0, 256)}](${track.uri}) in \`${Name}\``)
        return message.channel.send({ embeds: [embed] })

    }
});
