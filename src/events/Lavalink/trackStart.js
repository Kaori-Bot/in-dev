const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js');
const delay = require('node:timers/promises').setTimeout;

async function trackStart(client, player, track, payload){
    const emoji = client.emoji;
    track.title = player.subTitle(track.title);
    track.startAt = Date.now();
    player.set(`data:currentSong`, track);

    const startEmbed = new MessageEmbed()
        .setAuthor({ name: 'Started playing', iconURL: client.config.imageUrl.music })
        .setDescription(`[${track.title}](${track.uri}) [${parseDuration(track.duration)}]`)
        .setThumbnail(track.displayThumbnail('hqdefault'))
        .setColor(client.colors.default);

    let buttons = [
        new MessageButton().setCustomId("track:previous").setEmoji(emoji.back).setStyle("SECONDARY"),
        new MessageButton().setCustomId("track:pause").setEmoji(emoji.pause).setStyle("SECONDARY"),
        new MessageButton().setCustomId("track:stop").setEmoji(emoji.stop).setStyle("DANGER"),
        new MessageButton().setCustomId("track:resume").setEmoji(emoji.resume).setStyle("SECONDARY"),
        new MessageButton().setCustomId("track:skip").setEmoji(emoji.skip).setStyle("SECONDARY")
    ];
    const actionRow = new MessageActionRow().addComponents(buttons);

    const startMessage = await client.channels.cache.get(player.textChannel).send({ embeds: [startEmbed], components: [actionRow] });
    player.setPlayingMessage(startMessage);

    const collectEmbed = new MessageEmbed().setColor(client.colors.default).setTitle('');
    const collector = startMessage.createMessageComponentCollector({
        filter: (interaction) => {
            if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId === interaction.member.voice.channelId) return true;
            else {
                interaction.reply({ content: `${emoji.error} You cannot use this buttons! Join voice channel **${interaction.guild.me.voice.channel.name}** to use.`, ephemeral: true });
                return false;
            };
        },
        time: track.duration,
    });
    collector.on("collect", async (interaction) => {
        if (!player) return collector.stop();
        await interaction.deferReply({ ephemeral: false, fetchReply: true });

        collector.resetTimer({ time: (track.duration - (player.position || 0)) });
        collectEmbed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic:true }), });

        if (interaction.customId === "track:previous") {
            const currentSong = player.queue.current;
            const prevSong = player.queue.previous;
            if (!prevSong || prevSong.identifier === currentSong.identifier) {
                await interaction.editReply({
                    embeds:[collectEmbed.setDescription(`**${emoji.error} |** Cannot go back. Previous song not found!`)], ephemeral: true
                });
            }
            else {
                player.play(prevSong);
                if (currentSong) player.queue.unshift(currentSong);
                await interaction.editReply({
                    embeds: [collectEmbed.setDescription(`**${emoji.back} |** Played the previous song [${player.subTitle(prevSong.title)}](${prevSong.uri})`)]
                });
            }
        }
        else if (interaction.customId === "track:pause") {
            player.pause(true);
            buttons[1] = buttons[1].setDisabled(true);
            startMessage.edit({ components: [actionRow.setComponents(buttons)] });
            await interaction.editReply({ 
                embeds: [collectEmbed.setDescription(`**${emoji.pause} | Paused** current song`)]
            });
            player.setMessage('pause_resume', await interaction.fetchReply());
            interaction.checkSkip = true;
        }
        else if (interaction.customId === "track:stop") {
            await player.stop();
            await player.queue.clear();
            await interaction.editReply({ embeds: [collectEmbed.setDescription(`**${emoji.stop} |** Stopped the music`)] });
            collector.stop('track:stop');
        }
        else if (interaction.customId === "track:resume") {
            if(!player.paused) {
                await interaction.editReply({ embeds: [collectEmbed.setDescription(`**${emoji.error} |** This button ${emoji.resume} only active if the music has been paused!`)] });
            }
            else {
                const pr_msg = player._message.pause_resume;
                player.pause(false);
                buttons[1] = buttons[1].setDisabled(false);
                if (pr_msg) pr_msg.delete();
                startMessage.edit({ components: [actionRow.setComponents(buttons)]})
                await interaction.editReply({ 
                    embeds: [collectEmbed.setDescription(`**${emoji.resume} | Resume** current song`)]
                });
            };
        }
        else if (interaction.customId === "track:skip") {
            await player.stop();
            if (player.queue.size !== 0) {
                await interaction.editReply({
                    embeds: [collectEmbed.setDescription(`**${emoji.skip} | Skipped** current song...`)]
                });
            }
            else {
                collector.stop();
                await interaction.editReply({ 
                    embeds: [collectEmbed.setDescription(`**${emoji.skip} | Skipped** current song... (_But, queue next song is not available_)`)]
                });
            }
        }

        await delay(1000 * 10);
        const checkAvailable = await interaction.fetchReply();
        if (checkAvailable && !interaction.checkSkip) await interaction.deleteReply();
    });
    collector.on('end', () => {
        if(startMessage) {
            const newButtons = [];
            buttons.forEach(button => {
                button.setDisabled(true);
                newButtons.push(button);
            });
            actionRow.setComponents(newButtons);
            startMessage.edit({ components: [actionRow] }).catch(_ => void 0);
        }
    });
    player.collector = collector;
};

exports.load = trackStart;
