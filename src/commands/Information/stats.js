const { MessageEmbed, version } = require("discord.js");
const os = require('os');

module.exports = {
    name: "stats",
    category: "Information",
    aliases: [ "status" ],
    description: "Show statistics or status bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
        const duration = formatUptime(client.uptime);
        const about = message.client.emoji.about;
        let usersCount = 0; 
        client.guilds.cache.forEach((guild) => {
            usersCount += guild.memberCount;
        });

        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setTitle(`${client.user.username} Bot Statistics`)
            .addFields([
                { name: 'Guilds', value: client.guilds.cache.size.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Channels', value: client.channels.cache.size.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Users', value: usersCount.toLocaleString().replaceAll(',', '.'), inline: true },
                { name: 'Library', value: `discord.js v${version}` },
                { name: 'Uptime', value: duration.toString() }
            ]);
            const vpsEmbed = new MessageEmbed()
                .setTitle('Virtual Private Server')
                .setColor(client.colors.default)
            	.addFields([
            		{ name: 'Host', value: `${os.type()} ${os.release()} (${os.arch()})` },
            		{ name: 'CPU', value: `${os.cpus()[0].model}` },
            		{ name: 'RAM', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
            		{ name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
            		{ name: 'CPU Load', value: `${(os.loadavg()[0]).toFixed(2)}%` },
            		{ name: 'CPU Cores', value: `${os.cpus().length}` },
            		{ name: 'Uptime', value: (formatUptime(os.uptime(),true)).toString() }
                        	])
            	.setFooter({ text: `Node Version: ${process.version}` });
         message.reply({embeds: [embed, vpsEmbed]});
    }
};

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
	seconds = minutes ? `and ${seconds} seconds` : seconds+' seconds';

	return `${days||''}${hours||''}${minutes||''}${seconds||''}`;
};
