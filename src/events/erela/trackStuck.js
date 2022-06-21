const { MessageEmbed } = require("discord.js");

function trackStuck(client, player, track, payload){
    const channel = client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
        .setColor(client.colors.red)
        .setDescription(`**${client.emoji.error} |** Error when loading song! Track is stuck`);
    channel.send({embeds: [embed]});
    client.logger.log('error', `Error when loading song! Track is stuck in [${player.guild}]`);
    if (!player.voiceChannel) player.destroy();
};

exports.load = trackStuck;
