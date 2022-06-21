function nodeCreate(client, node){
    client.logger.log('info',`[Lavalink] Node '${node.options.identifier}' created.`);
};

exports.load = nodeCreate;
