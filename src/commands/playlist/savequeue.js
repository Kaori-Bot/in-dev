const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = new CommandBuilder({
    name: "savequeue",
    aliases: ["plsaveq"],
    description: "Save current playing queue in your playlist.",
    usage: "<playlist name>",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {

        const Name = args[0].replace(/_/g, ' ');
        const player = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Currently No Music Is Playing..`);
            return message.reply({ embeds: [embed] });
        }
        const data = await db.find({ UserId: message.author.id, PlaylistName: Name })
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`Playlist not found. Please enter the correct playlist name`)] })
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`Playlist not found. Please enter the correct playlist name`)] });
        }
        const song = player.queue.current;
        const tracks = player.queue;

        let oldSong = data.Playlist;
        if (!Array.isArray(oldSong)) oldSong = [];
        const newSong = [];
        if (player.queue.current) {
            newSong.push({
                "title": song.title,
                "uri": song.uri,
                "author": song.author,
                "duration": song.duration
            });
        }
        for (const track of tracks)
            newSong.push({
                "title": track.title,
                "uri": track.uri,
                "author": track.author,
                "duration": track.duration
            });
        const playlist = oldSong.concat(newSong);
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name,
        },
            {
                $set: {
                    Playlist: playlist
                }

            });
        const embed = new MessageEmbed()
            .setDescription(`**Added** \`${playlist.length - oldSong.length}\`song in \`${Name}\``)
            .setColor(client.colors.default)
        return message.channel.send({ embeds: [embed] })

    }
});
