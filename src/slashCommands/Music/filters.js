const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "filters",
    description: "Set EqualizerBand",
    permissions: [],
    requiredPlaying: true,
    permissions: { onlyDj: true },
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "filter",
            description: "Set EqualizerBand",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Clear",
                    value: "clear"
                },
                {
                    name: "Bass",
                    value: "bass",
                },
                {
                    name: "Night Core",
                    value: "night"
                },
                {
                    name: "Picth",
                    value: "picth"
                },
                {
                    name: "Distort",
                    value: "distort"
                },
                {
                    name: "Equalizer",
                    value: "eq"
                },
                {
                    name: "8D",
                    value: "8d"
                },
                {
                    name: "Bassboost",
                    value: "bassboost"
                },
                {
                    name: "Speed",
                    value: "speed"
                },
                {
                    name: "Vaporwave",
                    value: "vapo"
                }
            ]
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const filter = interaction.options.getString("filter");

        const player = interaction.client.manager.get(interaction.guildId);
        if (!player.queue.current) {
            const embed = new MessageEmbed()
                .setDescription('there is nothing playing')
                .setColor(client.colors.default)
            return interaction.editReply({ embeds: [embed] });
        }
        const emojiequalizer = client.emoji.filter;

        let embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTimestamp()
        switch (filter) {

            case 'bass':
                player.setBassboost(true);
                embed.setDescription(`${emojiequalizer} Bass mode is ON`);
                break;
            case 'eq':
                player.setEqualizer(true);
                embed.setDescription(`${emojiequalizer} Trablebass mode is ON`);
                break;
            case 'bassboost':
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                player.setEQ(...bands);
                embed.setDescription(`${emojiequalizer} Bassboost mode is ON`);
                break;
            case 'night':
                player.setNightcore(true);
                embed.setDescription(`${emojiequalizer} Night Core Equalizer mode is ON`);
                break;
            case 'pitch':
                player.setPitch(2);
                embed.setDescription(`${emojiequalizer} Pitch Equalizer mode is ON`);
                break;
            case 'distort':
                player.setDistortion(true);
                embed.setDescription(`${emojiequalizer} Distort Equalizer mode is ON`);
                break;
            case 'vapo':
                player.setVaporwave(true);
                embed.setDescription(`${emojiequalizer} Vaporwave Equalizer mode is ON`);
                break;
            case 'clear':
                player.clearEffects();
                embed.setDescription(`${emojiequalizer} Equalizer mode is OFF`);
                break;
            case 'speed':
                player.setSpeed(2);
                embed.setDescription(`${emojiequalizer} Speed mode is OFF`);
            case '8d':
                player.set8D(true);
                embed.setDescription(`${emojiequalizer} 8D mode is OFF`);
        }
        return interaction.editReply({ embeds: [embed] });
    }
};
