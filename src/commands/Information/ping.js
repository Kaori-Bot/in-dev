module.exports = {
    name: "ping",
    category: "Information",
    description: "Check the bot latency",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
      
    message.reply({ content: "Pinging..." }).then(async (msg) => {
        const ping = msg.createdTimestamp - message.createdTimestamp;
        msg.edit({ content: `Pong! Latency: **${ping}** ms` });
    });
 }
}
