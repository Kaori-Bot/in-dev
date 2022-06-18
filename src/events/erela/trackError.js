const { MessageEmbed } = require("discord.js");

function trackError(client, player, track, payload){
    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
        .setColor(client.colors.red)
        .setDescription("❌ Error when loading song! Track is error");
    channel.send({embeds: [embed]});
    client.logger.log(`Error when loading song! Track is error in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();
};

exports.load = trackError;
