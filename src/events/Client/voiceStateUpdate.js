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
          .setTitle(`Resuming...`)
          .setColor(client.colors.green)
          .setDescription(
            `Music has been resuming, because someone back join to my voice channel.`
          );
        const pausedMsg = player.getMessage('voiceStatePaused');
        if(pausedMsg) pausedMsg.delete();
        client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(message=>setTimeout(()=>message.delete(), 10000));

        const npm = player.playingMessage;
        const msg2 = await client.channels.cache
          .get(player.textChannel)
          .send({ embeds: npm.embeds, components: npm.components });

        player.setPlayingMessage(msg2);
        player.pause(false);
      }
      break;
    case "LEAVE":
      if (stateChange.members.size === 0 && !player.paused && player.playing) {
        player.pause(true);

        const embed = new MessageEmbed()
          .setTitle(`Paused!`)
          .setColor(client.colors.red)
          .setDescription(`Music has been paused, because everybody left my voice channel.`);
        client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(message => player.setMessage('voiceStatePaused', message));
      }
      break;
  }
};

exports.load = voiceStateUpdate;
