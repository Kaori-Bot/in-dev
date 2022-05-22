const { MessageEmbed } = require("discord.js");

function trackStuck(client, player, track, payload){
    
    const channel = client.channels.cache.get(player.textChannel);
    const thing = new MessageEmbed()
        .setColor(client.colors.red)
        .setDescription("❌ Error when loading song! Track is stuck");
    channel.send({embeds: [thing]});
    client.logger.log(`Error when loading song! Track is stuck in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();
};

exports.load = trackStuck;
