module.exports = {
    prefix: process.env.PREFIX || "k?",
    developerId: process.env.DEVELOPER_ID || "561170896480501790",
    colors: {
        green: '#57F287',
        red: '#ED4245',
        yellow: '#FEE75C',
        toString: () => '#F2AD58'
    },
    nodes: [{
        host: process.env.NODE_HOST || "ls.devin-dev.xyz",
        identifier: process.env.NODE_ID || "local",
        port: parseInt(process.env.NODE_PORT || "2333"),
        password: process.env.NODE_PASSWORD || "lavalink",
        secure: Boolean(process.env.NODE_SECURE),
    }],
};
