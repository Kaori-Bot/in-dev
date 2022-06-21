function nodeConnect(client, node){
    client.logger.log('ready',`[Lavalink] Node '${node.options.identifier}' connected.`);
};

exports.load = nodeConnect;
