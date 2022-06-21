const { MessageEmbed } = require("discord.js");

function trackError(client, player, track, payload){
    console.error(payload.error);
    const channel = client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
        .setColor(client.colors.red)
        .setDescription(`**${client.emoji.error} |** Error when loading song! Track is error`);
    channel.send({ embeds: [embed] });
    client.logger.log('error',`Error when loading song! Track is error in [${player.guild}]`);
    if (!player.voiceChannel) player.destroy();
};

exports.load = trackError;
