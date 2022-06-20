const CommandBuilder = require('../CommandBuilder');
const Discord = require("discord.js");

module.exports = new CommandBuilder({
    name: "eval",
    description: "Eval Code",
    usage: "<code>",
    permissions: {
        onlyDeveloper: true
    },
    private: true,
    async execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('BLUE');

        try {
            let code = args.join(" ");
            if (!args[0]) code = String("You not input the code?");
            let evaled = await eval(code);

            if (typeof evaled !== "string") evaled = await require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
            embed.setDescription(`\`\`\`js\n${output}\`\`\``)

            message.channel.send({embeds: [embed]});

        } catch (error) {
            error = clean(error);
            embed.setDescription(`\`\`\`js\n${error}\`\`\``)
            message.channel.send({embeds: [embed]});
        }
    }
});

function clean(string) {
    if (typeof text === "string") {
        return string.replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
        return string;
    }
};
