function nodeReconnect(client, node){
    client.logger.log('info',`[Lavalink] Node '${node.options.identifier}' reconnected.`);
};

exports.load = nodeReconnect;
