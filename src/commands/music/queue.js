const CommandBuilder = require('../CommandBuilder');
const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require('lodash');
const parseDuration = require('../../utils/parseDuration');
const progressBar = require('../../utils/progressBar');

module.exports = new CommandBuilder({
    name: "queue",
    aliases: ["q"],
    description: "Show the music queue and now playing.",
    options: {
        requiredPlaying: true
    },
    async execute(client, message, args, prefix) {

        const player = client.manager.get(message.guild.id);
        const queue = player.queue;  

        if (!player || !queue) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.colors.default).setTimestamp().setDescription(`Nothing is playing right now.`)]});

            if(player.queue.length === 0 || !player.queue.length) {
                return require('./nowplaying').execute(client, message, args);
            }
            else {
                player.queue.forEach(async track => await track.resolve());
                const queuedSongs = player.queue.map((track, i) => `[\`${++i}.\`] [${player.subText(track.title)}](${track.uri}) [\`${parseDuration(track.duration)}\`] by ${track.requester}`);

                const mapping = load.chunk(queuedSongs, 10);
                const pages = mapping.map((s) => s.join("\n"));
                let page = 0;

                if(player.queue.size < 11) {
                    const embed = new MessageEmbed()
                    .setColor(client.colors.default)
                    .setDescription(`**Now playing** [${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}`)
                    .addFields([
                        { name: '🗒️ Queue List', value: pages[page] }
                    ])
                    .setThumbnail(player.queue.current.thumbnail)
                    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true})})

                    await message.channel.send({
                        embeds: [embed]
                    })
                }
                else {
                    const embed2 = new MessageEmbed()
                    .setColor(client.colors.default)
                    .setDescription(`**Now playing** [${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}`)
                    .addFields([
                        { name: '🗒️ Queue List', value: pages[page] }
                    ])
                    .setThumbnail(player.queue.current.thumbnail)
                    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true}) });

                    const but1 = new MessageButton()
                    .setCustomId("queue_cmd_but_1")
                  
                    .setEmoji(client.emoji.right)
                    .setStyle("PRIMARY")

                    const but2 = new MessageButton()
                    .setCustomId("queue_cmd_but_2")
                    .setEmoji(client.emoji.left)
                    .setStyle("PRIMARY")

                    const but3 = new MessageButton()
                    .setCustomId("queue_cmd_but_3")
                    .setLabel(`Page ${page + 1} of ${pages.length}`)
                    .setStyle("SECONDARY")
                    .setDisabled(true)

                    const row1 = new MessageActionRow().addComponents([
                        but2, but3, but1
                    ]);

                    const msg = await message.channel.send({
                        embeds: [embed2],
                        components: [row1]
                    })

                    const collector = message.channel.createMessageComponentCollector({
                        filter: (b) => {
                            if(b.user.id === message.author.id) return true;
                            else {
                                b.reply({
                                    ephemeral: true,
                                    content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`
                                });
                                return false;
                            };
                        },
                        time: 60000*5,
                        idle: 30e3
                    });

                    collector.on("collect", async (button) => {
                        if(button.customId === "queue_cmd_but_1") {
                            await button.deferUpdate().catch(() => {});
                            page = page + 1 < pages.length ? ++page : 0;

                            const embed3 = new MessageEmbed()
                    .setColor(client.colors.default)
                    .setDescription(`**Now playing** [${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}`)
                    .addFields([
                        { name: '🗒️ Queue List', value: pages[page] }
                    ])
                    .setThumbnail(player.queue.current.thumbnail)
                    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true}) });

                            await msg.edit({
                                embeds: [embed3],
                                components: [new MessageActionRow().addComponents(but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1)]
                            })
                        } else if(button.customId === "queue_cmd_but_2") {
                            await button.deferUpdate().catch(() => {});
                            page = page > 0 ? --page : pages.length - 1;

                            const embed4 = new MessageEmbed()
    .setColor(client.colors.default)
    .setDescription(`**Now playing** [${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}`)
    .addFields([
        { name: '🗒️ Queue List', value: pages[page] }
                    ])
    .setThumbnail(player.queue.current.thumbnail)
    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({ dynamic: true }) });
                            await msg.edit({
                                embeds: [embed4],
                                components: [new MessageActionRow().addComponents(but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1)]
                 }).catch(() => {});
                        } else return;
                    });

                    collector.on("end", async () => {
                        const actionRow = new MessageActionRow().addComponents([
                            but2.setDisabled(true),
                            but3,
                            but1.setDisabled(true)
                    ]);
                        await msg.edit({
                            components: [actionRow]
                        })
                    });
                }
            }
       }
  });
