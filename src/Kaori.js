const { Client, Collection } = require("discord.js");
const KaoriManager = require('./structures/Manager');
const { readdirSync } = require("fs");
const mongoose = require('mongoose');

require("./structures/Player"); 

class MusicBot extends Client {
	 constructor(options={}) {
        super(options);
        
     this.commands = new Collection();
     this.slashCommands = new Collection();
     this.config = require("./config.js");
     this.colors = this.config.colors;
     this.aliases = new Collection();
     this.commands = new Collection();
     this.logger = require("./utils/logger.js");
     this.emoji = require("./utils/emoji.json");

   /**
    *  Mongose for data base
    */
		 const dbOptions = {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
      };
        mongoose.connect(process.env.MONGO_URI, dbOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
         this.logger.log('[DB] DATABASE CONNECTED', "ready");
              });
        mongoose.connection.on('err', (err) => {
         console.log(`Mongoose connection error: \n ${err.stack}`, "error");
              });
        mongoose.connection.on('disconnected', () => {
         console.log('Mongoose disconnected');
              });
        
    /**
     * Error Handler
     */
    this.on("disconnect", () => console.log("Bot is disconnecting..."))
    this.on("reconnecting", () => console.log("Bot reconnecting..."))
    this.on('warn', error => console.log(error));
    this.on('error', error => console.log(error));
    const client = this;
    this.manager = new KaoriManager(client);
		  
/**
 * Client Events
 */
   readdirSync("./src/events/Client/").forEach(file => {
    const event = require(`./events/Client/${file}`);
    this.on(event.name, (...args) => event.run(this, ...args));
});
/**
 * Erela Manager Events
 */ 
  readdirSync("./src/events/Lavalink/").forEach(file => {
    const event = require(`./events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    this.logger.log(`Loading Events Lavalink ${eventName}`, "event");
    this.manager.on(eventName, event.bind(null, this));
});
/**
 * Import all commands
 */
  readdirSync("./src/commands/").forEach(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        this.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
        this.commands.set(command.name, command);
    }
})
/**
 * SlashCommands 
 */
  const data = [];
       
  readdirSync("./src/slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
    
        for (const file of slashCommandFile) {
            const slashCommand = require(`./slashCommands/${dir}/${file}`);

            if(!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if(!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            this.slashCommands.set(slashCommand.name, slashCommand);
            this.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`, "cmd");
            data.push(slashCommand);
        }
     });
	  this.on("ready", async () => {
        await this.application.commands.set(data).then(() => this.logger.log(`Client Application (/) Registered.`, "cmd")).catch((e) => console.log(e));
    });
	 }
    async login(botToken) {
        if(!botToken) botToken = process.env.TOKEN;
        super.login(botToken);
        return this;
    };
};
module.exports = MusicBot;
