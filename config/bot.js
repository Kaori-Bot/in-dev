module.exports = {
    prefix: process.env.PREFIX || "k?",
    developerId: process.env.DEVELOPER_ID || "xxx",
    nodes: [{
        host: process.env.NODE_HOST || "ls.devin-dev.xyz",
        identifier: process.env.NODE_ID || "local",
        port: parseInt(process.env.NODE_PORT || "2333"),
        password: process.env.NODE_PASSWORD || "lavalink",
        secure: Boolean(process.env.NODE_SECURE),
    }],
};
