const CommandBuilder = require('../CommandBuilder');
const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");
const categoryEmoji = require('../emoji.json');

module.exports = new CommandBuilder({
    name: "help",
    aliases: [ "h" ],
    description: "Return all commands, or one specific command",
    async execute(client, message, args, prefix) {
        const buttons = [];
        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setAuthor({ name: `${client.user.username} Help`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription('This is my available commands list.')
            .setFooter({ text: `Choose a list from the buttons below` })
            .setFields([]);
        const categories = client.commands.categories.filter(category => category !== 'developer');
        for (const category of categories) {
            const commands = client.commands.filter(cmd => cmd.category == category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const commandList = commands.map(command => `\`${command.name}\``).join(', ');
            embed.fields.push({ name: `${categoryEmoji[category]} ${categoryName} Commands`, value: commandList });
            buttons.push(
                new MessageButton()
                    .setCustomId(category)
                    .setEmoji(categoryEmoji[category])
                    .setStyle('SECONDARY')
            );
        };
        buttons.push(
            new MessageButton()
                .setCustomId('help:delete')
                .setEmoji(client.emoji.error)
                .setStyle('DANGER')
        );
        const actionRow = new MessageActionRow().addComponents(buttons);
        message.reply({ embeds: [embed], components: [actionRow] }).then(m => createInteractionCollector(m, message));
    }
});

function createInteractionCollector(m, msg) {
    const client = m.client;
    const category = client.commands.categories;
    const commands = Array.from(client.commands.keys());
    const embed = new MessageEmbed().setColor(client.colors.default);
    const collector = m.createMessageComponentCollector({
        filter: (interaction) => {
            if(category.includes(interaction.customId)) return true;
            if(commands.includes(interaction.customId)) return true;
            if(interaction.user.id === msg.author.id) {
                if(interaction.customId==='help:delete') {
                    if(!m) return;
                    interaction.reply({ content: `**${client.emoji.success} |** Message has been deleted!`, ephemeral: true });
                    return m.delete().catch(_ => void 0);
                };
                return true;
            };
        },
        time: 60000
    });
    collector.on('collect', async(interaction) => {
        await interaction.deferReply({ ephemeral: true });
        collector.resetTimer({ time: 120000, idle: 60000 });
        const value = interaction.customId;

        if(interaction.isButton()){
            const categoryName = value.charAt(0).toUpperCase() + value.slice(1);
            const commandData = client.commands.filter(cmd => cmd.category === value);
            const commandList = commandData.map(command => `\`${command.name}\``).join(', ');
            const menu = new MessageSelectMenu()
                .setCustomId(value)
                .setPlaceholder('Select commands for spesific information');
            const menuOptions = [];
            commandData.forEach(command => {
                menuOptions.push({ label:  command.name, description: command.description, value: command.name });
            });
            menu.addOptions(menuOptions);
            const actionRow = new MessageActionRow().addComponents([menu]);
            embed.setTitle(`${categoryEmoji[value]} ${categoryName} Commands`).setDescription(commandList);
            interaction.editReply({ embeds:[embed], components: [actionRow] });
        }
    });
    collector.on('end', (collected) => {
        if(!m) return;
        const oldActionRow = m.components[0];
        const newActionRow = new MessageActionRow();
        const newButtons = [];
        oldActionRow.components.forEach(oldButton => {
            oldButton.setDisabled(true);
            newButtons.push(oldButton);
        });
        newActionRow.addComponents(newButtons);
        m.edit({ components: [newActionRow] }).catch(_ => void 0);
    });
    return collector;
};
