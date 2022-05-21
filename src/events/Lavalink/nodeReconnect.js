function nodeReconnect(client, node){
    client.logger.log(`Lavalink: Node '${node.options.identifier}' reconnected.`, "log");
};

exports.load = nodeReconnect;
