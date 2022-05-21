function nodeDisconnect(client, node, reason){
    console.warn(`Lavalink: Node '${node.options.identifier}' disconnected:`, reason);
};

exports.load = nodeDisconnect;
