const CommandBuilder = require('../CommandBuilder');
const { MessageEmbed } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = new CommandBuilder({
    name: "removetrack",
    aliases: ["plremovet"],
    description: "Removetrack from your saved Playlists.",
    usage: "<playlist name> <track number>",
    options: {
        requiredPlaying: true,
        inVoiceChannel: true,
        sameVoiceChannel: true,
    },
    async execute(client, message, args, prefix) {
        var color = client.colors.default;

        const Name = args[0].replace(/_/g, ' ');
        const data = await db.findOne({ UserId: message.author.id, PlaylistName: Name });
        if (!data) {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        if (data.length == 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setDescription(`You don't have a playlist with **${Name}** name`)] });
        }
        const Options = args[1];
        if (!Options || isNaN(Options)) {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setDescription(`You didn't entered track number (the Track you want to remove (ID OF IT))\nSee all your Tracks: ${prefix}info ${Name}`)] });
        }
        let tracks = data.Playlist;
        if (Number(Options) >= tracks.length || Number(Options) < 0) {
            return message.reply({ embeds: [new MessageEmbed().setColor(color).setDescription(`Your provided track number is out of Range (\`0\` - ${tracks.length - 1})\nSee all your Tracks: \`${prefix}info\` showdetails ${Name}`)] });

        }
        await db.updateOne({
            UserId: message.author.id,
            PlaylistName: Name
        },
            {
                $pull: {
                    Playlist: data.Playlist[Options]
                }
            });
            const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`Removed **${tracks[Options].title}** from \`${Name}\``);
            return message.channel.send({embeds: [embed]});
    }
});
