const { Manager, Structure } = require("erela.js");
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
		this._client = client;
	}
	loadEvents() {
		const {readdirSync} = require('fs');
		readdirSync("./src/events/Lavalink/").forEach(file => {
			const event = require(`../events/Lavalink/${file}`);
			event.name = file.split(".")[0];
			this.on(event.name, (...args) => event.load(this, ...args));
		});
		this._client.logger.log('Events Lavalink: Loaded...', 'info');
	}
};

Structure.extend('Player', Player => {
	class KaoriPlayer extends Player {
		constructor(...args) {
			super(...args);
			this.speed = 1;
			this.pitch = 1;
			this.rate = 1;
			this._8d = false;
			this.nightcore = false;
			this.vaporwave = false;
			this.bassboost = false;
			this.distortion = false;
		}
		set8D(value) {
			if(typeof value !== "boolean") throw new RangeError(`[ set8D Function Error ]: Please provide a valid value (true/false).`);

			if(!this.filters) this.filters = true;
			this._8d = value;
			if(this._8d) {
				this.node.send({
					op: "filters",
					guildId: this.guild,
					rotation: {
						rotationHz: 0.2
					}
				});
			}
			else {
				this.node.send({
					op: "filters",
					guildId: this.guild,
					rotation: {
						rotationHz: 0.0 
					}
				});
			};
			return this;
		}
		setSpeed(speed) {
			if (isNaN(speed)) throw new RangeError('Player#setSpeed() Speed must be a number.');

			this.speed = Math.max(Math.min(speed, 5), 0.05);
			this.setTimescale(speed);
			return this;
		}
		setPitch(pitch) {
			if (isNaN(pitch)) throw new RangeError('Player#setPitch() Pitch must be a number.');

			this.pitch = Math.max(Math.min(pitch, 5), 0.05);
			this.setTimescale(this.speed, pitch);
			return this;
		}
		setNightcore(nighcore) {
			if (typeof nighcore !== 'boolean') throw new RangeError('Player#setNighcore() Nightcore can only be "true" or "false".');

			this.nightcore = nighcore;
			if(nighcore) {
				this.bassboost = false;
				this.distortion = false;
				this.vaporwave = false;
				this.setVaporwave(false);
				this.setBassboost(false);
				this.setDistortion(false);
				this.setTimescale(1.2999999523162842, 1.2999999523162842, 1);
			} else {
				this.setTimescale(1, 1, 1);
			}
			return this;
		}
		setVaporwave(vaporwave) {
			if (typeof vaporwave !== 'boolean') {throw new RangeError('Player#setVaporwave() Vaporwave can only be "true" or "false".');}

			this.vaporwave = vaporwave;
			if(vaporwave) {
				this.nightcore = false;
				this.bassboost = false;
				this.distortion = false;
				this.setBassboost(false);
				this.setNightcore(false);
				this.setDistortion(false);
				this.setTimescale(0.8500000238418579, 0.800000011920929, 1);
			} else {
				this.setTimescale(1, 1, 1);
			}
			return this;
		}
		setDistortion(distortion) {
			if (typeof distortion !== 'boolean') throw new RangeError('Player#setDistortion() Distortion can only be "true" or "false"');

			this.distortion = distortion;
			if(distortion) {
				this.nightcore = false;
				this.vaporwave = false;
				this.bassboost = false;
				this.setBassboost(false);
				this.setNightcore(false);
				this.setVaporwave(false);
				this.setDistort(0.5);
			} else {
				this.clearEffects();
			}
			return this;
		}
		setBassboost(bassboost) {
			if (typeof bassboost !== 'boolean') throw new RangeError('Player#setBassboost() Bassboost can only be "true" or "false".');

			this.bassboost = bassboost;
			if(bassboost) {
				this.nightcore = false;
				this.vaporwave = false;
				this.setVaporwave(false);
				this.setNightcore(false);
				this.setEqualizer(1, 0.85);
			} else {
				this.clearEffects();
			}
			return this;
		}
		setDistort(value) {
			this.value = value || this.value;

			this.node.send({
				op: 'filters',
				guildId: this.guild,
				distortion: {
					distortion: this.value,
				},
			});
			return this;
		}
		setEqualizer(band, gain) {
			this.band = band || this.band;
			this.gain = gain || this.gain;

			this.node.send({
				op: 'filters',
				guildId: this.guild,
				equalizer: [
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
				],
			});
			return this;
		}
		setTimescale(speed, pitch, rate) {
			this.speed = speed || this.speed;
			this.pitch = pitch || this.pitch;
			this.rate = rate || this.rate;

			this.node.send({
				op: 'filters',
				guildId: this.guild,
				timescale: {
					speed: this.speed,
					pitch: this.pitch,
					rate: this.rate,
				},
			});
			return this
		}
		clearEffects() {
			this.speed = 1;
			this.pitch = 1;
			this.rate = 1;
			this.bassboost = false;
			this.nightcore = false;
			this.vaporwave = false;
			this.distortion = false;
			this.clearEQ();

			this.node.send({
				op: 'filters',
				guildId: this.guild,
			});
			return this;
		}
		getCollection() {
			const hasGuild = this.get(this.guild);
			if(!hasGuild) super.set(this.guild, new (require('discord.js')).Collection());
			return this.get(this.guild);
		}
		getMessage(type) {
			if(!type) throw new Error();
			const collection = this.getCollection();
			return collection.get(type);
		}
		setMessage(type, message) {
			if(!type || !message) throw new Error();
			const collection = this.getCollection();
			collection.set(type, message);
			return collection;
		}
		setNowplayingMessage(message) {
			const nowPlayingMessage = this.getMessage('nowPlaying');
			if(nowPlayingMessage) {
				nowPlayingMessage.delete();
				this.setMessage('nowPlaying', nowPlayingMessage);
			}
			else{
				this.getCollection().set('nowPlaying', message);
			}
			return nowPlayingMessage;
		}
		subTitle(text, length) {
			if(!text || !length) throw new RangeError('Target: invalid!');
			if(typeof text !== 'string') throw new TypeError('Target: text is not string!');
			if(typeof length !== 'number') throw new TypeError('Target: length is not number!');
			return text.length > length ? text.substr(0, length-3) + '...' : text;
		}
	}
	return KaoriPlayer;
});

module.exports = KaoriManager;
