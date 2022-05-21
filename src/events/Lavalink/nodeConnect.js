function nodeConnect(client, node){
    client.logger.log(`Lavalink: Node '${node.options.identifier}' connected.`, "ready");
};

exports.load = nodeConnect;
