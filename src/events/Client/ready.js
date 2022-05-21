const { prefix } = require("../../config.js");

module.exports ={
name: "ready",
run: async (client) => {
    client.registerApplicationCommand('794187901000744991');
    client.manager.init(client.user.id);
 
    client.logger.log(`${client.user.tag} online!`, 'ready');
    client.user.setStatus('idle');
 }
}
