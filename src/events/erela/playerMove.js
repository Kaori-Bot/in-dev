const { MessageEmbed } = require("discord.js");

function playerMove(client, player, oldChannel, newChannel){
    const embed = new MessageEmbed().setColor(client.colors.default);
    const guild = client.guilds.cache.get(player.guild);
    if(!guild) return;

    const channel = guild.channels.cache.get(player.textChannel);
    if(!channel) return;
    if(!player) return;

    if(oldChannel === newChannel) return;
    if(newChannel === null || !newChannel) {
        channel.send({ embeds: [embed.setDescription(`I've been disconnected from <#${oldChannel}>`)] });
        return player.destroy();
    }
    else {
        player.voiceChannel = newChannel;
        if(channel) channel.send({ embeds: [embed.setDescription(`Player voice channel moved to <#${player.voiceChannel}>`)] });
        if(player.paused) player.pause(false);
    }
};

exports.load = playerMove;
