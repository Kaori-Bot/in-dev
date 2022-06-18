const CommandBuilder = require('../CommandBuilder');

module.exports = new CommandBuilder({
    name: "ping",
    description: "Check the bot latency",
    execute: (client, message, args, prefix) => {
        message.reply({ content: "Pinging..." }).then(async (msg) => {
            const ping = msg.createdTimestamp - message.createdTimestamp;
            msg.edit({ content: `Pong! Latency: **${ping}** ms` });
        });
    }
});
