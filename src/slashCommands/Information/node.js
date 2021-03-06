const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "node",
    description: "check lavalink server information",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
          ephemeral: false
        });
        const embeds = [];
        const embed = new MessageEmbed().setColor(client.colors.default);

        let index = 0;
        client.manager.nodes.forEach(node => {
            embed.setTitle(`Nodes #${index++}`)
            embed.setDescription(`Identifier: \`${(node.options.identifier)}\``)
            embed.addFields([
                { name: 'Players', value: `${node.stats.playingPlayers.toLocaleString()} / ${node.stats.players.toLocaleString()}` },
                { name: 'Memory Usage', value: `${(Math.round(node.stats.memory.used / 1024 / 1024)).toLocaleString()} MB / ${(Math.round(node.stats.memory.reservable / 1024 / 1024)).toLocaleString()} MB` },
                { name: 'CPU', value: `• Cores: ${node.stats.cpu.cores}\n• System Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\n• Lavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%` },
                { name: 'Uptime', value: (formatUptime(node.stats.uptime)) }
            ]);
            embeds.push(embed);
        });

        await interaction.followUp({embeds: [...embeds]})
    }
}

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
