const { MessageEmbed, Client, CommandInteraction, Permissions } = require("discord.js");
const db2 = require("../../schema/dj");

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
 
async function interactionCreate(client, interaction) {
        let prefix = client.config.prefix;

        if (interaction.isSelectMenu()) selectMenuInteraction(client, interaction); 
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'add-song-queue') {
                await interaction.reply({content: `Received Modal from ${interaction.customId} with text input: \`${interaction.fields.getTextInputValue('songQuery')}\``, ephemeral: true });
            }
        }
        if (interaction.isCommand() || interaction.isContextMenu()) {

            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            if (SlashCommands.owner && interaction.author.id !== `${client.config.developerId}`) {
                await interaction.editReply({
                    content: `Only <@491577179495333903> can use this command!`
                }).catch(() => { });
            }
            if (!interaction.member.permissions.has(SlashCommands.permissions || [])) {
                return await interaction.reply({ content: `You need this \`${SlashCommands.permissions.join(", ")}\` permission to use this command `, ephemeral: true })
            }
            const player = interaction.client.manager.get(interaction.guildId);
            if (SlashCommands.requiredPlayer && !player) {
                return await interaction.editReply({
                    content: `There is no player for this guild.`, ephemeral: true
                }).catch(() => { });
            }
            if (SlashCommands.inVoiceChannel && !interaction.member.voice.channel) {
                return await interaction.editReply({
                    content: `You must be in a voice channel!`, ephemeral: true
                }).catch(() => { });
            }
            if (SlashCommands.sameVoiceChannel) {
                if (interaction.guild.me.voice.channel) {
                    if (interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
                        return await interaction.reply({
                            content: `You must be in the same channel as ${interaction.client.user}`, ephemeral: true
                        }).catch(() => { });
                    }
                }
            }
            if (SlashCommands.permissions ? SlashCommands.permissions.onlyDj : false) {
                let data = await db2.findOne({ Guild: interaction.guildId })
                let perm = Permissions.FLAGS.MUTE_MEMBERS;
                if (data) {
                    if (data.Mode) {
                        let pass = false;
                        if (data.Roles.length > 0) {
                            interaction.member.roles.cache.forEach((x) => {
                                let role = data.Roles.find((r) => r === x.id);
                                if (role) pass = true;
                            });
                        };
                        if (!pass && !interaction.member.permissions.has(perm)) return await interaction.reply({ content: `You don't have permission or dj role to use this command`, ephemeral: true })
                    };
                };
            };

            try {
                await SlashCommands.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.followUp({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
        } else return;
};

const commandCategoryEmoji = require('../../commands/emoji.json');
async function selectMenuInteraction(client, interaction) {
    await interaction.deferUpdate();
    if (client.commands.categories.includes(interaction.customId)) {
        const command = client.commands.get(interaction.values[0]);
        if (!command) return interaction.followUp({ content: `Cannot find the commands!`, ephemeral: true });
        const categoryName = command.category.charAt(0).toUpperCase() + command.category.slice(1);
        const embed = new MessageEmbed()
            .setColor(client.colors.default)
            .setTitle(command.name)
            .setDescription(command.description)
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/microsoft/310/information_2139-fe0f.png')
            /*
            .addFields([
                { name: '\u200B', value: '\u200B' },
            ])
            */
            .setFooter({ text: `${commandCategoryEmoji[command.category]} ${categoryName} Commands` });
        if(command.aliases[0]) embed.fields.push({ name: 'Aliases', value: command.aliases.map(a => `\`${a}\``).join(', '), inline: true });
        if(command.usage) {
            embed.fields.push({ name: 'Usage', value: `\`${command.usage}\``, inline: true });
            embed.fields.push({ name: 'Example', value: `\`${client.config.prefix}${command.name} ${command.usage}\``, inline: true });
        };

        await interaction.followUp({ embeds: [embed], ephemeral: true });
    };
};

exports.load = interactionCreate;
