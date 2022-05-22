const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');

async function trackStart(client, player, track, payload){
    const emoji = client.emoji;
    track.title = track.title > 70 ? track.title.substr(0, 67) + '...' : track.title;
    track.startAt = new Date();
    track.startTimestamp = Date.now();
    player.set(`${player.guild}_currentSong`, track);

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
    if(!player.queue.previous) buttons[0] = buttons[0].setDisabled(true);
    const row = new MessageActionRow().addComponents(buttons);

    const startMessage = await client.channels.cache.get(player.textChannel).send({ embeds: [startEmbed], components: [row] });
    player.setPlayingMessage(startMessage);

    const embed = new MessageEmbed().setColor(client.colors.default)
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
        await interaction.deferReply();
        if (!player) return collector.stop();
        collector.resetTimer({ time: (track.duration - (player.position || 0)) });
        if (interaction.customId === "previous") {
            const currentSong = player.queue.current;
            const prevSong = player.queue.previous;
            player.play(prevSong);
            if (currentSong) player.queue.unshift(currentSong);
            await interaction.editReply({
                embeds: [
                    embed.setAuthor({name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic:true })})
                    .setDescription(`${emoji.back} Played the previous song [${player.subTitle(prevSong.title)}](${prevSong.uri})`)
                ]
            }).then(i => setTimeout(() => i.delete(), deleteTimeout));
        }
        else if (interaction.customId === "stop") {
            await player.stop();
            await player.queue.clear();
            interaction.editReply({ embeds: [embed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${emoji.stop} Stopped the music`)] }).then(msg => setTimeout(() => msg.delete(), deleteTimeout));
            return collector.stop();
        }
        else if (interaction.customId === "pause") {
            player.pause(!player.paused);
            const context = player.paused ? `${emoji.pause} Paused` : `${emoji.resume} Resume`;
            if (player.paused) {
                buttons[1] = buttons[1].setStyle('PRIMARY').setEmoji(emoji.resume)
            }
            else {
                buttons[1] = buttons[1].setStyle('SECONDARY').setEmoji(emoji.pause);
            };
            startMessage.edit({ embeds:[startEmbed], components: [new MessageActionRow().addComponents(buttons)] });
            await interaction.editReply({ embeds: [embed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`**${context}** current song`)] }).then(msg => setTimeout(() => msg.delete(), deleteTimeout));
        }
        else if (interaction.customId === "skip") {
            await player.stop();
            await interaction.editReply({ embeds: [embed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) }).setDescription(`${emoji.skip} Skipped current song...`)] }).then(msg => setTimeout(() => msg.delete(), deleteTimeout));
            if (track.length === 1) {
                return collector.stop();
            }
        }
        else if (interaction.customId === "loop") {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
            await interaction.editReply({
                embeds: [
                    embed.setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${emoji.loop} **${queueRepeat}** loop`)
                ]
            }).then(i => setTimeout(() => i.delete(), deleteTimeout));
        }
    });
    collector.on('end', () => {
        if(startMessage) {
            const newButton = [];
            buttons.forEach(button => {
                button.setDisabled(true);
                newButton.push(button);
            });
            startMessage.edit({
                embeds: [startEmbed],
                components:[
                    new MessageActionRow().addComponents(newButton)
                ]
            }).catch(_ => void 0);
        }
    });
};

exports.load = trackStart;
