function nodeError(client, node, error){
    client.logger.log('error',`[Lavalink] Node '${node.options.identifier}' encountered an error: ${error.message}`);
};

exports.load = nodeError;
