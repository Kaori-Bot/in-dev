function ready(client) {
    // client.postStats();
    client.registerApplicationCommand('794187901000744991');
    client.manager.init(client.user.id);

    client.user.setPresence({
        activities:[{
            name: 'Under Development | v2.0.0-dev',
            type: 0
        }],
        status: 'dnd'
    });
    client.logger.log('ready',`[Client] Login as ${client.user.tag}.`);
};

exports.load = ready;
