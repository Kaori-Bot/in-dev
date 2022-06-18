class Command {
    constructor(data) {
        this.name = data.name;
        this.aliases = data.aliases || [];
        this.description = data.description || 'No description';
        this.usage = data.usage || null;
        this.options = {
            inVoiceChannel: data.options ? data.options.inVoiceChannel : false,
            requiredPlaying: data.options ? data.options.requiredPlaying : false,
            sameVoiceChannel: data.options ? data.options.sameVoiceChannel : false,
        };
        this.permissions = {
            me: data.permissions ? data.permissions.me : [],
            user: data.permissions ? data.permissions.user : [],
            onlyDj: data.permissions ? data.permissions.onlyDj : false,
            onlyDeveloper: data.permissions ? data.permissions.onlyDeveloper : false,
        };
        if(data.args) this.args = data.args;
        this.private = data.private || false;
        this.execute = data.execute ? typeof data.execute == 'function' ? data.execute : () => {throw new TypeError(`${this.constructor.name}.execute`, 'Type is not function!')} : () => {};
    }
    baseEmbed(type='', message) {
        const { MessageEmbed } = require('discord.js');
        const colors = require('../../config/colors.json');
        switch (type.toLowerCase()) {
            case 'error':
                return new MessageEmbed().setcolor(colors.red);
            case 'music':
                return new MessageEmbed()
                    .setColor(colors.default)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true, format: 'png' }) });
            case 'success':
                return new MessageEmbed().setColor(colors.green);
            case 'warn':
                return new MessageEmbed().setColor(colors.yellow)
            default:
                return new MessageEmbed().setColor(colors.default);
        }
    }
    get category() {
        const { readdirSync } = require('fs');
        const categories = readdirSync('./src/commands').filter(x => !x.includes('.'));

        let commandCategory = '';
        categories.forEach(directory => {
            const commands = readdirSync(`./src/commands/${directory}`);
            if (commands.includes(this.name+'.js')) commandCategory = directory;
        });
        return commandCategory;
    }
};

module.exports = Command;
