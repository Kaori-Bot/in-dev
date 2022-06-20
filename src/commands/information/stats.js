const CommandBuilder = require('../CommandBuilder');
const { MessageActionRow, MessageButton, MessageEmbed, version } = require("discord.js");
const os = require('os');
const package = require('../../../package.json');

module.exports = new CommandBuilder({
    name: "stats",
    aliases: ["status"],
    description: "Show bot statistics",
    async execute(client, message, args, prefix) {
        const duration = formatUptime(client.uptime);
        let usersCount = 0; 
        client.guilds.cache.forEach((guild) => {
            usersCount += guild.memberCount;
        });

        const actionRow = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('command:stats_lavalink')
                    .setLabel('Lavalink')
                    .setEmoji(client.emoji.lavalink)
                    .setStyle('PRIMARY')
            ]);

        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setTitle(`${client.user.username} Bot Statistics`)
            .setDescription(`\`Build Version:\` \`${package.version}\``)
            .addFields([
                { name: 'Guilds', value: client.guilds.cache.size.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Channels', value: client.channels.cache.size.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Users', value: usersCount.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Library', value: `discord.js v${version}` },
                { name: 'Uptime', value: duration.toString() }
            ])
            .setFooter({ text: `Node: ${process.version}` });

        message.reply({embeds: [embed], components: [actionRow]}).then(msg => {
            const buttons = [
                new MessageButton()
                    .setCustomId('command:stats_home')
                    .setEmoji(client.emoji.left)
                    .setLabel('Back')
                    .setStyle('SECONDARY')
            ];

            const newRow = new MessageActionRow().addComponents(buttons);

            const collector = msg.createMessageComponentCollector({
                filter: (i) => {
                    if(i.user.id === message.author.id) return true; 
                    i.reply({ content: `**${client.emoji.error} |** You cannot use this buttons!`, ephemeral: true });
                    return false;
                }, time: 1000*60 });
            collector.on('collect', interaction => {
                collector.resetTimer({ time: 1000*60, idle: 1000*30 });
                interaction.deferUpdate().catch(_ => void 0);
                if(interaction.customId==='command:stats_lavalink') {
                    const embedL = new MessageEmbed()
                        .setColor(client.colors.default)
                        .setTitle('Lavalink Node Statistics')
                        .setThumbnail(client.config.imageUrl.lavalink)
                        .setDescription('This shows the current status of the online Lavalink Nodes. Every node contains a dynamic amount of players. This is for balancing music processes outside of the main bot nodes.');

                    let index = 0;
                    client.manager.nodes.forEach(node=> {
                        embedL.fields.push({
                            name: `Nodes #${index++}`,
                            value:
                                `• **Players:** ${node.stats.playingPlayers} / ${node.stats.players}`
                                +`\n• **Memory Usage:** ${(Math.round(node.stats.memory.used / 1024 / 1024)).toLocaleString().replaceAll(',','.')} MiB / ${(Math.round(node.stats.memory.reservable / 1024 / 1024)).toLocaleString().replaceAll(',','.')} MiB`
                                +`\n• **System Load:** ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`
                                +`\n• **Lavalink Load:** ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`
                                +`\n• **Uptime:** ${(formatUptime(node.stats.uptime))}`
                        });
                    });
                    msg.edit({ embeds: [embedL], components: [newRow] }).catch(_ => void 0);
                }
                else if(interaction.customId==='command:stats_home') {
                    msg.edit({ embeds: [embed], components: [actionRow] }).catch(_ => void 0);
                }
            });

            collector.on('end', () => {
                if(!msg) return;
                const button = msg.components[0].components.map(b=>b.setDisabled(true));
                const newRow = new MessageActionRow().addComponents(button);
                msg.edit({ components: [newRow] }).catch(_ => void 0);
            });
        });
    }
});

function formatUptime(uptime, force=false) {
    let millisecond = (uptime / 1000);
    if (force) millisecond = uptime;
    let days = Math.floor((millisecond % (31536 * 100)) / 86400);
    let hours = Math.floor((millisecond / 3600) % 24);
    let minutes = Math.floor((millisecond / 60) % 60);
    let seconds = Math.floor(millisecond % 60);
    days = days > 0 ? days+' days, ' : false;
    hours = hours > 0 ? hours+' hours, ' : false;
    minutes = minutes > 0 ? minutes+' minutes, ' : false;
    seconds = minutes ? `and ${seconds} seconds` : (hours ? `0 minutes, and ${seconds} seconds` : seconds+' seconds');

    return `${days||''}${hours||''}${minutes||''}${seconds||''}`;
};
