const { Manager } = require("erela.js");
const AppleMusic = require('erela.js-apple');
const DeezerMusic = require('erela.js-deezer');
const Spotify = require("erela.js-spotify");

class KaoriManager extends Manager {
	constructor(client) {
		super({
			nodes: client.config.nodes,
			plugins: [
				new AppleMusic(),
				new DeezerMusic(),
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
		readdirSync("./src/events/erela/").forEach(file => {
			const event = require(`../events/erela/${file}`);
			event.name = file.split(".")[0];
			this.on(event.name, (...args) => event.load(this.client, ...args));
		});
		this.client.logger.log('[Events:Erela] Loaded...', 'info');
	}
};

require('./Player');
module.exports = KaoriManager;
