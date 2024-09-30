const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const channel = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channel);
const role = fs.readFileSync('config/roles.json');
const rconfig = JSON.parse(role)
module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        function CreateMsg() {
            const userName = 'Shyybi';
            const userIcon = 'https://avatars.githubusercontent.com/u/146101928?v=4';
            const logId = cconfig.log;
            const author = message.author;
            const content = message.content;
            const msgChan = message.channel.name;
            const logChann = message.guild.channels.cache.get(logId);

            const logMsg = new EmbedBuilder()
                .setColor(0x48f542)
                .setTitle('Created Message')
                .addFields(
                    { name: " ", value: " " },
                    { name: 'From user:', value: `${author}`, inline: true },
                    { name: 'In:', value: `#${msgChan}`, inline: true },
                    { name: " ", value: " " },
                    { name: " ", value: " " },
                    { name: 'Content', value: `${content}` },
                    { name: " ", value: " " },
                )
                .setThumbnail("https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg")
                .setTimestamp()
                .setFooter({ text: `by ${userName}`, iconURL: `${userIcon}` });

            if(message.author.id == "1177559796975669340") {
                return;
            }
            else {
                if (logChann) {
                    logChann.send({ embeds: [logMsg] }).catch(console.error);
                } else {
                    console.error("logChann is undefined or null");
                }
            }
        }
        CreateMsg();

    }
};