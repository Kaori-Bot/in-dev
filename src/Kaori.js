const { Client, Collection } = require("discord.js");
const KaoriManager = require('./structures/Manager');

class KaoriBot extends Client {
	constructor(options={}) {
		super(options);
		this.commands = new Collection();
		this.slashCommands = new Collection();
		this.config = require("../config/bot.js");
		this.colors = require("../config/colors.json");
		this.emoji = require("../config/emoji.json");
		this.logger = require("./utils/logger.js");
	}
	async loadCommands() {
		const { readdirSync } = require('fs');
		this.commands.categories = [];
		this.slashCommands.categories = [];
		this.slashCommands._data = [];
		readdirSync("./src/commands/").filter(x => !x.includes('.')).forEach(dir => {
			const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`./commands/${dir}/${file}`);
				this.commands.set(command.name, command);
			}
			this.commands.categories.push(dir);
		});
		this.logger.log('info','[Commands] Loaded...');

		readdirSync("./src/slashCommands/").forEach(dir => {
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
				this.slashCommands.categories.push(dir);
			}
		});
		this.logger.log('info','[SlashCommands] Loaded...');
	}
	async loadEvents() {
		const { readdirSync } = require('fs');
		readdirSync("./src/events/discord/").forEach(file => {
			const event = require(`./events/discord/${file}`);
			event.name = file.split('.')[0];
			this.on(event.name, (...args) => event.load(this, ...args));
		});
		this.logger.log('info','[Events:Discord] Loaded...');
	}
	async loadMongo() {
		const mongoose = require('mongoose');
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
				this.logger.log('ready','[Mongoose] Database connected.');
			});
			mongoose.connection.on('err', (err) => {
				console.error(`[Mongoose:Connection]`, err.stack);
			});
			mongoose.connection.on('disconnected', () => {
				this.logger.log('info','[Mongoose] Database disconnected...');
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
		this.manager.loadEvents();

		return this;
	}
	async registerApplicationCommand(guildId, force=false) {
		if(!this.isReady) throw new Error('Cannot register Application Commands before client is ready!');
		const _data = this.slashCommands._data;
		if(!_data) throw new Error('[SlashCommands] Data not available!');
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
			this.logger.log('ready','[SlashCommands] Registered.');
		}
		catch(error) {
			console.error(error);
		}
	}
	postStats() {
		const { AutoPoster } = require('topgg-autoposter');
		this.dblPoster = AutoPoster(process.env.TOPGG_TOKEN, this);
		this.dblPoster.on('posted', (stats) => {
			client.logger.log('ready', `Posting stats on https://top.gg/bot/${this.user.id} | ${stats.serverCount} servers`);
		});
		return 'Stats posted on https://top.gg/bot/'+this.user.id;
	}
};
module.exports = KaoriBot;
