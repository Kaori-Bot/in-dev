const Discord = require('discord.js');
const KaoriClient = require('./src/Kaori.js');
const client = new KaoriClient({
    allowedMentions:{
        parse: ['users', 'roles'],
        repliedUser: false
    },
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', error => console.error(error));

client.login(process.env.TOKEN);

module.exports = client;
