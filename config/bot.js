module.exports = {
    prefix: process.env.PREFIX || "k?",
    developerId: process.env.DEVELOPER_ID || "561170896480501790",
    nodes: [{
        host: process.env.NODE_HOST,
        identifier: process.env.NODE_ID || "main",
        port: parseInt(process.env.NODE_PORT || "2333"),
        password: process.env.NODE_PASSWORD,
        secure: Boolean(process.env.NODE_SECURE)
    }]
};
