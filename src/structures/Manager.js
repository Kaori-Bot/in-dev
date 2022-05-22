const { Manager } = require("erela.js");
const AppleMusic = require('erela.js-apple');
const DeezerMusic = require('erela.js-deezer');
const Facebook = require('erela.js-facebook');
const Spotify = require("erela.js-spotify");

class KaoriManager extends Manager {
	constructor(client) {
		super({
			nodes: client.config.nodes,
			plugins: [
				new AppleMusic(),
				new DeezerMusic(),
				new Facebook(),
				new Spotify({
					clientID: process.env.SPOTIFY_CLIENT_ID,
					clientSecret: process.env.SPOTIFY_CLIENT_SECRET
				}),
			],
			send(guildId, dataPayload) {
				const guild = client.guilds.cache.get(guildId);
				if (guild) guild.shard.send(dataPayload);
			},
		});
		this.client = client;
	}
	loadEvents() {
		const { readdirSync } = require('fs');
		readdirSync("./src/events/Lavalink/").forEach(file => {
			const event = require(`../events/Lavalink/${file}`);
			event.name = file.split(".")[0];
			this.on(event.name, (...args) => event.load(this.client, ...args));
		});
		this.client.logger.log('Events Lavalink: Loaded...', 'info');
	}
};

require('./Player');
module.exports = KaoriManager;
