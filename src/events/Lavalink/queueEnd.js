const { MessageEmbed } = require("discord.js");

function queueEnd(client, player){
	const channel = client.channels.cache.get(player.textChannel);
	const endedEmbed = new MessageEmbed()
		.setColor('LIGHT_GREY')
		.setDescription(`Song queue has ended.`);
	channel.send({embeds: [endedEmbed] }).then(message => player.destroy());
};

exports.load = queueEnd;
