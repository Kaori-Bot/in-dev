const { MessageEmbed } = require("discord.js");

async function voiceStateUpdate(client, oldState, newState) {
  const player = client.manager.get(newState.guild.id);
  if (!player || player.state !== "CONNECTED") return;

  const stateChange = {};
  if (oldState.channel === null && newState.channel !== null)
    stateChange.type = "JOIN";
  if (oldState.channel !== null && newState.channel === null)
    stateChange.type = "LEAVE";
  if (oldState.channel !== null && newState.channel !== null)
    stateChange.type = "MOVE";
  if (oldState.channel === null && newState.channel === null) return; // you never know, right
  if (newState.serverMute == true && oldState.serverMute == false)
    return player.pause(true);
  if (newState.serverMute == false && oldState.serverMute == true)
    return player.pause(false);
  // move check first as it changes type
  if (stateChange.type === "MOVE") {
    if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
    if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
  }
  // double triggered on purpose for MOVE events
  if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
  if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

  // check if the bot's voice channel is involved (return otherwise)
  if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
    return;

  // filter current users based on being a bot
  stateChange.members = stateChange.channel.members.filter(
    (member) => !member.user.bot
  );

  switch (stateChange.type) {
    case "JOIN":
      if (stateChange.members.size === 1 && player.paused) {
        const embed = new MessageEmbed()
          .setTitle(`Voice Channel Update`)
          .setColor(client.colors.green)
          .setDescription(
            `**${client.emoji.resume} |** Music has been resuming, because someone back join to my voice channel.`
          );
        const pausedMsg = player.message.voiceStatePaused;
        if(pausedMsg) {
            pausedMsg.edit({ embeds: [embed] });
            setTimeout(() => {
                pausedMsg.delete();
                clearInterval(pausedMsg.interval);
                player.setMessage('voiceStatePaused', null);
            }, 10000);
        }

        /*const npm = player.playingMessage;
        const msg2 = await client.channels.cache
          .get(player.textChannel)
          .send({ embeds: npm.embeds, components: npm.components });*/

        // player.setPlayingMessage(player.playingMessage);
        player.pause(false);
      }
      break;
    case "LEAVE":
      if (stateChange.members.size === 0 && !player.paused && player.playing) {
        player.pause(true);

        const embed = new MessageEmbed()
          .setTitle(`Voice Channel Empty`)
          .setColor(client.colors.red)
          .setDescription(`**${client.emoji.pause} |** Music has been paused, because everybody left my voice channel.`);
        if (player.playingMessage) {
            player.playingMessage.reply({ embeds: [embed] }).then(message => {
                message.interval = setInterval(() => {
                    if(player.collector) player.collector.resetTimer({ time: player.queue.current.duration - (player.position || 0) });
                }, 1000);
                player.setMessage('voiceStatePaused', message)
            });
        }
      }
      break;
  }
};

exports.load = voiceStateUpdate;
