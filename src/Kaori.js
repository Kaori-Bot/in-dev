const { Client, Collection } = require("discord.js");
const KaoriManager = require('./structures/Manager');
const { readdirSync } = require("fs");
const mongoose = require('mongoose');

require("./structures/Player"); 

class KaoriBot extends Client {
	constructor(options={}) {
		super(options);
		this.commands = new Collection();
		this.slashCommands = new Collection();
		this.config = require("./config.js");
		this.colors = this.config.colors;
		this.logger = require("./utils/logger.js");
		this.emoji = require("./utils/emoji.json");
	}
	async loadCommands() {
		this.slashCommands._data = [];
		readdirSync("./src/commands/").forEach(dir => {
			const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`./commands/${dir}/${file}`);
				this.commands.set(command.name, command);
			}
		});
		this.logger.log('Commands: Loaded...', 'info');

		readdirSync("./src/slashCommands/").forEach((dir) => {
			const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
			for (const file of slashCommandFile) {
				const slashCommand = require(`./slashCommands/${dir}/${file}`);
				if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);
				if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);
				this.slashCommands.set(slashCommand.name, slashCommand);
				this.slashCommands._data.push({
					name: slashCommand.name,
					description: slashCommand.description,
					options: slashCommand.options ? slashCommand.options : []
				});
			}
		});
		this.logger.log('SlashCommands: Loaded...', 'info');
	}
	async loadEvents() {
		readdirSync("./src/events/Client/").forEach(file => {
			const event = require(`./events/Client/${file}`);
			event.name = file.split('.')[0];
			this.on(event.name, (...args) => event.load(this, ...args));
		});
		this.logger.log('Events Client: Loaded...', 'info');

		readdirSync("./src/events/Lavalink/").forEach(file => {
			const event = require(`./events/Lavalink/${file}`);
			event.name = file.split(".")[0];
			this.manager.on(event.name, (...args) => event.load(this, ...args));
		});
		this.logger.log('Events Lavalink: Loaded...', 'info');
	}
	async loadMongo() {
		const dbOptions = {
			useNewUrlParser: true,
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
			useUnifiedTopology: true,
		};
		mongoose.connect(process.env.MONGO_URI, dbOptions)
			mongoose.Promise = global.Promise;
			mongoose.connection.on('connected', () => {
				this.logger.log('Mongoose: Database connected.', 'ready');
			});
			mongoose.connection.on('err', (err) => {
				console.error(`Mongoose Connection:`, err.stack);
			});
			mongoose.connection.on('disconnected', () => {
				this.logger.log('Mongoose: Database disconnected...', 'info');
			});
	}
	async login(botToken) {
		if(!botToken) botToken = process.env.TOKEN;

		this.manager = new KaoriManager(this);
		this.on('warn', error => console.warn(error));
		this.on('error', error => console.error(error));
		super.login(botToken);

		this.loadCommands();
		this.loadEvents();
		this.loadMongo();

		return this;
	}
	async registerApplicationCommand(guildId, force=false) {
		if(!this.isReady) throw new Error('Cannot register Application Commands before client is ready!');
		const _data = this.slashCommands._data;
		if(!_data) throw new Error('SlashCommands: Data not available!');
		try {
			if(force) {
				_data.forEach(async data => {
					if(guildId) {
						await this.application.commands.create(data, guildId);
					}else{
						await this.application.commands.create(data);
					}
				});
			};
			if(guildId) {
				await this.application.commands.set(_data, guildId);
			}else{
				await this.application.commands.set(_data);
			}
			this.logger.log('SlashCommands: Registered.', 'ready');
		}
		catch(error) {
			console.error(error);
		}
	}
};
module.exports = KaoriBot;
