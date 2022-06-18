const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const parseDuration = require('../../utils/parseDuration.js')
const ms = require('ms');

module.exports = {
    name: "seek",
    description: "Seek the currently playing song",
    permissions: [],
    requiredPlaying: true,
    permissions: { onlyDj: true },
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "time",
            description: "<10s || 10m || 10h>",
            required: true,
            type: "STRING"
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const args = interaction.options.getString("time");
        const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const time = ms(args)
        const position = player.position;
        const duration = player.queue.current.duration;

        const emojiforward = client.emoji.forward;
        const emojirewind = client.emoji.rewind;

        const song = player.queue.current;

        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let embed = new MessageEmbed()
                    .setDescription(`${emojiforward} **Forward**\n[${song.title}](${song.uri})\n\`${parseDuration(time)} / ${parseDuration(duration)}\``)
                    .setColor(client.colors.default)
                    .setTimestamp()
                return await interaction.editReply({ embeds: [embed] });
            } else {
                player.seek(time);
                let embed = new MessageEmbed()
                    .setDescription(`${emojirewind} **Rewind**\n[${song.title}](${song.uri})\n\`${parseDuration(time)} / ${parseDuration(duration)}\``)
                    .setColor(client.colors.default)
                    .setTimestamp()
                return await interaction.editReply({ embeds: [embed] });
            }
        } else {
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${parseDuration(duration)}\``);
            return await interaction.editReply({ embeds: [embed] });
        }

    }
};
