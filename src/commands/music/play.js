const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed, Permissions } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js');

module.exports = new CommandBuilder({
    name: "play",
    aliases: ["p"],
    description: "Plays audio from YouTube or Soundcloud",
    args: true,
    usage: "<Song Name | YouTube URL | Spotify URL>",
    options: {
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    execute: async (client, message, args, prefix) => {

        if (!message.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });

        const { channel } = message.member.voice;

        if (!message.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.colors.default).setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });

        const emojiaddsong = message.client.emoji.song_add;
        const emojiplaylist = message.client.emoji.playlist

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
            volume: 100,
        });

        if (player.state != "CONNECTED") await player.connect();
        const search = args.join(' ');
        let res;

        try {
            res = await player.search(search, message.author);
        if (!player) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.colors.default).setTimestamp().setDescription("Nothing is playing right now...")] });
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw res.exception;
            }
        } catch (err) {
            return message.reply(`There was an error while searching: ${err.message}`);
        }
        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                return message.channel.send({ embeds: [new MessageEmbed().setColor(client.colors.default).setTimestamp().setDescription(`No matches found for - ${search}`)] });
            case 'TRACK_LOADED':
                var track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size) {
                return player.play();
                }
                else {
                    const embed = new MessageEmbed()
                    .setColor(client.colors.default)
                    .setTimestamp()
                    .setThumbnail(track.displayThumbnail("hqdefault"))
                    .setDescription(`${emojiaddsong} **Added song to queue**\n[${track.title}](${track.uri}) - \`[${parseDuration(track.duration)}]\``)
                    return message.channel.send({ embeds: [embed] });
                }
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                const embed = new MessageEmbed()
                    .setColor(client.colors.default)
                    .setTimestamp()
                    .setDescription(`${emojiplaylist} **Added playlist to queue**\n${res.tracks.length} Songs [${res.playlist.name}](${search}) - \`[${parseDuration(res.playlist.duration)}]\``)
                return message.channel.send({ embeds: [embed] });
            case 'SEARCH_RESULT':
                var track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size) {
                    return player.play();
                }
                else {
                    const embed = new MessageEmbed()
                        .setColor(client.colors.default)
                        .setTimestamp()
                        .setThumbnail(track.displayThumbnail("hqdefault"))
                        .setDescription(`${emojiaddsong} **Added song to queue**\n[${track.title}](${track.uri}) - \`[${parseDuration(track.duration)}]\`[<@${track.requester.id}>]`)
                    return message.channel.send({ embeds: [embed] });
                }
        }
    }
});
