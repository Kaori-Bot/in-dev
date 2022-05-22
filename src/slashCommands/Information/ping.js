module.exports = {
    name: "ping",
    description: "Check the bot latency",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.editReply({ content: "Pinging..." }).then(async () => {
            const ping = Date.now() - interaction.createdTimestamp;

            await interaction.editReply({
                content: `Pong! Latency: **${ping}** ms`
            });
        })
    }
}
