const { MessageEmbed } = require('discord.js');
const channelId = '816627182930493460';

async function guildCreate(client, guild) {
    const channel = client.channels.cache.get(channelId);
    const owner = await client.users.fetch(guild.ownerId);
    const embed = new MessageEmbed()
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024}))
        .setTitle(`📥 Joined a Guild`)
        .addField('Name', `\`${guild.name}\``)
        .addField('ID', `\`${guild.id}\``)
        .addField('Owner', `\`${owner ? owner.user.tag : "Unknown#0000"}\` ${guild.ownerId || '0'}`)
        .addField('Member Count', `\`${guild.memberCount}\` Members`)
        .addField('Creation Date', `<t:${String(guild.createdTimestamp).substr(0,10)}:f>`)
        .setColor(client.colors.green)
        .addField(`${client.user.username}'s Server Count`, `+ \`${client.guilds.cache.size}\` Severs`)
        .setTimestamp();
    channel.send({embeds: [embed]});
};

exports.load = guildCreate;
