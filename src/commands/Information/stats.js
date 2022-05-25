const { MessageEmbed, version } = require("discord.js");
const formatDuration = require('../../utils/formatDuration');
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
        const duration = formatDuration(client.uptime);
        const about = message.client.emoji.about;
        let ccount = client.channels.cache.size;
        let scount = client.guilds.cache.size;
        let usersCount = 0; 
client.guilds.cache.forEach((guild) => {
    usersCount += guild.memberCount 

})
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
            		{ name: 'Uptime', value: (formatDuration(os.uptime())).toString() }
                        	])
            	.setFooter({ text: `Node Version: ${process.version}` });
            /*.setDescription(`${about} **Status**
**= STATISTICS =**
**• Servers** : ${scount}
**• Channels** : ${ccount}
**• Users** : ${mcount}
**• Discord.js** : v${version}
**• Node** : ${process.version}
**= SYSTEM =**
**• Platfrom** : ${os.type}
**• Uptime** : ${duration1}
**• CPU** :
> **• Cores** : ${os.cpus().length}
> **• Model** : ${os.cpus()[0].model} 
> **• Speed** : ${os.cpus()[0].speed} MHz
**• MEMORY** :
> **• Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps
> **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(2)} Mbps
> **• Heap Total** : ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} Mbps
> **• Heap Usage** : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mbps
`);*/
         message.reply({embeds: [embed, vpsEmbed]});
    }
}
