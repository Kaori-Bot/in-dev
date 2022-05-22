const { MessageEmbed } = require("discord.js");

function queueEnd(client, player){
	const channel = client.channels.cache.get(player.textChannel);
	const ended = new MessageEmbed()
		.setColor(client.colors.default)
		.setDescription(`Song queue has ended. Add more song to continue playing...`);
	channel.send({embeds: [ended] }).then(message => {
		const npMessage = player.getMessage('nowPlaying');
		if(npMessage) npMessage.delete();
		player.destroy();
	});
};

exports.load = queueEnd;
