function ready(client) {
    client.postDBL();
    client.registerApplicationCommand('794187901000744991');
    client.manager.init(client.user.id);

    client.logger.log(`Client: Login as ${client.user.tag}.`, 'ready');
    client.user.setStatus('idle');
};

exports.load = ready;
