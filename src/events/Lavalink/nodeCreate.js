function nodeCreate(client, node){
    client.logger.log(`Lavalink: Node '${node.options.identifier}' created.`, "log");
};

exports.load = nodeCreate;
