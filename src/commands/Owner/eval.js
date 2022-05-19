const Discord = require("discord.js");

module.exports = {
    name: "eval",
    category: "Owner",
    description: "Eval Code",
    args: false,
    usage: "<string>",
    permission: [],
    owner: true,
 execute: async (message, args, client, prefix) => {
        const embed = new Discord.MessageEmbed()
            .setColor(client.colors.green)

        try {
            const code = args.join(" ");
            if (!code) return message.channel.send("Please include the code.");
            let evaled = await eval(code);

            if (typeof evaled !== "string") evaled = await require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);
            embed.setDescription(`\`\`\`${output}\`\`\``)

            message.channel.send({embeds: [embed]});

        } catch (error) {
            let err = clean(error);
            embed.setDescription(`\`\`\`\n${err}\`\`\``)
            message.channel.send({embeds: [embed]});
        }
    }
}

function clean(string) {
    if (typeof text === "string") {
        return string.replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
        return string;
    }
							}
