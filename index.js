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

const { AutoPoster } = require('topgg-autoposter');
const poster = AutoPoster(process.env.TOPGG_TOKEN, client);
poster.on('posted', (stats) => {
    client.logger.log(`Posting stats on https://top.gg/bot/${client.user.id} | ${stats.serverCount} servers`, 'ready');
});

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', error => console.error(error));

client.login(process.env.TOKEN);

module.exports = client;
