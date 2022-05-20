const { prefix } = require("../../config.js");

module.exports ={
name: "ready",
run: async (client) => {
	client.logger.log('ApplicationCommand: Starting reset...', 'info')
    client.guilds.cache.forEach(async(guild) => {
        try{
        const appCmd = await guild.commands.fetch();
        if (appCmd.size > 0) appCmd.forEach(cmd=>cmd.delete());
        }catch(error){
            // none
        }
    });
    client.logger.log('ApplicationCommand: Reset!', 'ready');
    
    client.registerApplicationCommand('794187901000744991');
    client.manager.init(client.user.id);
 
    client.logger.log(`${client.user.tag} online!`, 'ready');
    client.user.setStatus('idle');
 }
}
