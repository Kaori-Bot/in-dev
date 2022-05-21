const { prefix } = require("../../config.js");

module.exports ={
name: "ready",
run: async (client) => {
    client.registerApplicationCommand('794187901000744991');
    client.manager.init(client.user.id);

    client.logger.log(`Client: Connected on ${client.user.tag}.`, 'ready');
    client.user.setStatus('idle');
 }
}
