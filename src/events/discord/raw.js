function raw(client, data) {
    client.manager.updateVoiceState(data);
};

exports.load = raw;
