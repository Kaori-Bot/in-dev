class Command {
    constructor(data) {
        this.name = data.name;
        this.aliases = data.aliases || [];
        this.description = data.description || 'No description';
        this.usage = data.usage || null;
        this.options = {
            isPlaying: data.options ? data.options.isPlaying : false,
            inVoiceChannel: data.options ? data.options.inVoiceChannel : false,
            sameVoiceChannel: data.options ? data.options.sameVoiceChannel : false,
            useArguments: data.options ? data.options.useArguments : false
        };
        this.permissions = {
            me: data.permissions ? data.permissions.me : [],
            user: data.permissions ? data.permissions.user : []
        };
        this.private = data.private || false;
        this.constructor.execute = typeof data.execute == 'function' ? data.execute : () => {throw new TypeError(`${this.constructor.name}.execute`, 'Type is not function!')};
    }
    get category(commandCategory) {
        const { readdirSync } = require('fs');
        const categories = readdirSync('./commands').filter(x => !x.includes('.'));
        categories.forEach(directory => {
            const commands = readdirSync(`./commands/${directory}`);
            if (commands.includes(this.name+'.js')) commandCategory = directory;
        });
        return commandCategory;
    }
    execute(...args) {
        return this.constructor.execute(...args);
    }
};

module.exports = Command;
