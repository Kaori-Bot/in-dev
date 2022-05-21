const { MessageEmbed } = require("discord.js");

function queueEnd(client, player){
	const channel = client.channels.cache.get(player.textChannel);
	const emojiwarn = client.emoji.warn;
	let thing = new MessageEmbed()
		.setColor(client.colors.toString())
		.setDescription(`${emojiwarn} **Music queue ended**`)
		.setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()});
	channel.send({embeds: [thing] }).then(message => {
		const npMessage = player.getMessage('nowPlaying');
		if(npMessage) npMessage.delete();
		player.destroy();
	});
};

exports.load = queueEnd;
