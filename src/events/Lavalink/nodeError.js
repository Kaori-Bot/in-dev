function nodeError(client, node, error){
    client.logger.log(`Lavalink: Node '${node.options.identifier}' encountered an error: ${error.message}`, "error");
};

exports.load = nodeError;
