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
                const queuedSongs = Promise.all(
                    player.queue.map(async(track, i) => {
                        if (track.resolve) {
                            track = await track.resolve().then(_ => track);
                        };
                        return `[\`${++i}.\`] [${player.subText(track.title)}](${track.uri}) [\`${parseDuration(track.duration)}\`] by ${track.requester}`;
                    })
                );

                const mapping = load.chunk(await queuedSongs, 10);
                const pages = mapping.map((s) => s.join("\n"));
                let page = 0;

                if(player.queue.size < 11) {
                    const embed = new MessageEmbed()
                    .setColor(client.colors.default)
                    .addFields([
                        { name: `${client.emoji.music} Now playing`, value: `[${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}` }
                    ])
                    .setDescription(pages[page])
                    .setThumbnail(client.config.imageUrl.music)
                    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true})})

                    await message.channel.send({
                        embeds: [embed]
                    })
                }
                else {
                    const embed2 = new MessageEmbed()
                    .setColor(client.colors.default)
                    .addFields([
                        { name: `${client.emoji.music} Now playing`, value: `[${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}` }
                    ])
                    .setDescription(pages[page])
                    .setThumbnail(client.config.imageUrl.music)
                    .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true}) });

                    const but1 = new MessageButton()
                    .setCustomId("queue_button_right")
                    .setEmoji(client.emoji.right)
                    .setStyle("PRIMARY");

                    const but2 = new MessageButton()
                    .setCustomId("queue_button_left")
                    .setEmoji(client.emoji.left)
                    .setStyle("PRIMARY");

                    const but3 = new MessageButton()
                    .setCustomId("queue_button_page")
                    .setLabel(`${page + 1}/${pages.length}`)
                    .setStyle("SECONDARY")
                    .setDisabled(true);

                    const but4 = new MessageButton()
                    .setCustomId('queue_button_fast-skip')
                    .setEmoji(client.emoji.forward)
                    .setStyle('SUCCESS');

                    const  but5 = new MessageButton()
                    .setCustomId('queue_button_message-delete')
                    .setEmoji(client.emoji.error)
                    .setStyle('DANGER');

                    const row1 = new MessageActionRow().addComponents([
                        but2, but3, but1, , but4, but5
                    ]);

                    const msg = await message.channel.send({
                        embeds: [embed2],
                        components: [row1]
                    })

                    const collector = message.channel.createMessageComponentCollector({
                        filter: (b) => {
                            if(b.user.id === message.author.id){
                                if(b.customId==='queue_button_message-delete'){
                                    if(!msg) return;
                                    b.reply({ ephemeral: true, content: `**${client.emoji.success} |** Message has been deleted!` });
                                    return msg.delete().catch(_ => void 0);
                                }
                                return true;
                            }
                            else {
                                b.reply({ ephemeral: true, content: `**${client.emoji.error} |** This buttons only for **${message.author.tag}**, run the command itself if you want.` });
                                return false;
                            };
                        },
                        time: 60000*5
                    });

                    collector.on("collect", async (button) => {
                        await button.deferUpdate().catch(_ => void 0);
                        collector.resetTimer({ time: 60000*5, idle: 30e3 });

                        if(page=pages.length){
                            but2.setDisabled(true);
                            but4.setEmoji(client.emoji.rewind);
                        }
                        else{
                            but1.setDisabled(true);
                            but4.setEmoji(client.emoji.forward);
                        }

                        if(button.customId === 'queue_button_fast-skip') {
                            let actionRow = [];
                            let newButton = button.components[0].filter(b => b.emoji.name == 'kaori_forward');

                            if(newButton[0].emoji.name === 'kaori_forward'){
                                page = pages.length;
                                actionRow = new MessageActionRow().addcomponents([but2, but3, but1, but4, but5]);
                            }
                            else{
                                page = 0;
                                actionRow = new MessageActionRow().addcomponents([but4, but2, but3, but1, but5]);
                            }
                            const embed = embedUpdate(page);
                            msg.edit({ embeds: [embed], components: [actionRow] })
                        }
                        if(button.customId === "queue_button_right") {
                            page = page + 1 < pages.length ? ++page : 0;

                            const embed3 = embedUpdate(page);

                            await msg.edit({
                                embeds: [embed3],
                                components: [new MessageActionRow().addComponents(but2, but3.setLabel(`${page + 1}/${pages.length}`), but1, but4, but5)]
                            })
                        } else if(button.customId === "queue_button_left") {
                            page = page > 0 ? --page : pages.length - 1;

                            const embed4 = embedUpdate(page);
                            await msg.edit({
                                embeds: [embed4],
                                components: [new MessageActionRow().addComponents(but4, but2, but3.setLabel(`${page + 1}/${pages.length}`), but1, but5)]
                 }).catch(() => {});
                        };
                        function embedUpdate() {
                            return new MessageEmbed()
                            .setColor(client.colors.default)
                            .addFields([
                                { name: `${client.emoji.music} Now playing`, value: `[${player.queue.current.title}](${player.queue.current.uri}) by ${player.queue.current.requester}\n\n${parseDuration(player.position)} ${progressBar(player.position, player.queue.current.duration).default} ${parseDuration(player.queue.current.duration)}` }
                            ])
                            .setDescription(pages[page])
                        .setThumbnail(client.config.imageUrl.music)
                        .setAuthor({ name: `${message.guild.name} Queue`, iconURL: message.guild.iconURL({dynamic:true}) });
                        };
                    });

                    collector.on("end", async () => {
                        const newButton = msg.components[0].components.map(button => button.setDisabled(true));
                        const actionRow = new MessageActionRow().addComponents(newButton);
                        await msg.edit({
                            components: [actionRow]
                        })
                    });
                }
            }
       }
  });
