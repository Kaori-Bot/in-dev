const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const delay = require('node:timers/promises').setTimeout;

async function trackStart(client, player, track, payload){
    const emoji = client.emoji;
    track.title = track.title > 70 ? player.subTitle(track.title) : track.title;
    track.startAt = new Date();
    track.startTimestamp = Date.now();
    player.set(`currentSong`, track);

    const startEmbed = new MessageEmbed()
        .setDescription(`Started playing **[${track.title}](${track.uri})** - \`[${convertTime(track.duration)}]\``)
        .setThumbnail(track.displayThumbnail(3))
        .setColor(client.colors.default);

    let buttons = [
        new MessageButton().setCustomId("previous").setEmoji(emoji.back).setStyle("SECONDARY"),
        new MessageButton().setCustomId("pause").setEmoji(emoji.pause).setStyle("SECONDARY"),
        new MessageButton().setCustomId("stop").setEmoji(emoji.stop).setStyle("DANGER"),
        new MessageButton().setCustomId("loop").setEmoji(emoji.loop).setStyle("SECONDARY"),
        new MessageButton().setCustomId("skip").setEmoji(emoji.skip).setStyle("SECONDARY")
    ];
    if (player.queueRepeat) buttons[3] = buttons[3].setStyle('SUCCESS');
    const actionRow = new MessageActionRow().addComponents(buttons);

    const startMessage = await client.channels.cache.get(player.textChannel).send({ embeds: [startEmbed], components: [actionRow] });
    player.setPlayingMessage(startMessage);

    const collectEmbed = new MessageEmbed().setColor(client.colors.default)
    const collector = startMessage.createMessageComponentCollector({
        filter: (interaction) => {
            if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId === interaction.member.voice.channelId) return true;
            else {
                interaction.reply({ content: `You must join voice channel **${interaction.guild.me.voice.channel.name}** to use this buttons.`, ephemeral: true });
                return false;
            };
        },
        time: track.duration,
    });
    collector.on("collect", async (interaction) => {
        const deleteTimeout = 10000;
        if (!player) return collector.stop();
        collector.resetTimer({ time: (track.duration - (player.position || 0)) });
        collectEmbed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic:true }), });
        if (interaction.customId === "previous") {
            const currentSong = player.queue.current;
            const prevSong = player.queue.previous;
            if (!prevSong || prevSong.identifier === currentSong.identifier) {
                return interaction.reply({ embeds:[collectEmbed.setDescription(`**${emoji.error} Previous song not found!** Please add more song to queue.`)], ephemeral: true });
            }
            player.play(prevSong);
            if (currentSong) player.queue.unshift(currentSong);
            await interaction.reply({
                embeds: [collectEmbed.setDescription(`${emoji.back} Played the previous song [${player.subTitle(prevSong.title)}](${prevSong.uri})`)],
                fetchReply: true
            });
            await delay(deleteTimeout);
            await interaction.deleteReply();
        }
        else if (interaction.customId === "stop") {
            await player.stop();
            await player.queue.clear();
            await interaction.reply({ embeds: [collectEmbed.setDescription(`${emoji.stop} Stopped the music`)], fetchReply: true });

            collector.stop();
            await delay(deleteTimeout);
            await interaction.deleteReply();
        }
        else if (interaction.customId === "pause") {
            player.pause(!player.paused);
            const context = player.paused ? `${emoji.pause} Paused` : `${emoji.resume} Resume`;
            if (player.paused) {
                buttons[1] = buttons[1].setStyle('PRIMARY').setEmoji(emoji.resume);
            }
            else {
                buttons[1] = buttons[1].setStyle('SECONDARY').setEmoji(emoji.pause);
            };
            startMessage.edit({ embed:[startEmbed], components: [new MessageActionRow().addComponents(buttons)] });
            await interaction.reply({ embeds: [collectEmbed.setDescription(`**${context}** current song`)], fetchReply: true });
            await delay(deleteTimeout);
            await interaction.deleteReply();
        }
        else if (interaction.customId === "skip") {
            await player.stop();
            if (player.queue.size > 1) {
                await interaction.reply({ embeds: [collectEmbed.setDescription(`**${emoji.skip} Skipped** current song...`)], fetchReply: true });
            }
            else {
                collector.stop();
                await interaction.reply({ embeds: [collectEmbed.setDescription(`**${emoji.skip} Skipped** current song... (_But song queue is not available. Force stop the current song_)`)], fetchReply: true });
            }

            await delay(deleteTimeout);
            await interaction.deleteReply();
        }
        else if (interaction.customId === "loop") {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
            if (player.queueRepeat) {
                buttons[3] = buttons[3].setStyle('SUCCESS');
            }
            else {
                buttons[3] = buttons[3].setStyle('SECONDARY');
            }
            startMessage.edit({ embed:[startEmbed], components:[new MessageActionRow().addComponents(buttons)] });
            await interaction.reply({
                embeds: [collectEmbed.setDescription(`**${emoji.loop} ${queueRepeat}** loop the song queue`)],
                fetchReply: true,
            });
            await delay(deleteTimeout);
            await interaction.deleteReply();
        }
    });
    collector.on('end', () => {
        if(startMessage) {
            const newButtons = [];
            buttons.forEach(button => {
                button.setDisabled(true);
                newButtons.push(button);
            });
            startMessage.edit({
                embed: [startEmbed],
                components:[
                    new MessageActionRow().addComponents(newButtons)
                ]
            }).catch(_ => void 0);
        }
    });
};

exports.load = trackStart;
