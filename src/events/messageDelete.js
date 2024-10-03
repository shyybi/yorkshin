const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const channel = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channel);

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(message) {
        function deleteMsg() {
            const userName = 'Shyybi';
            const userIcon = 'https://avatars.githubusercontent.com/u/146101928?v=4';
            const logId = cconfig.log;
            const author = message.author;
            const content = message.content;
            const msgChan = message.channel.name;
            const logChann = message.guild.channels.cache.get(logId);

            const logMsg = new EmbedBuilder()
                .setColor(0xf54242)
                .setTitle("Deleted Message")
                .addFields(
                    { name: 'From user:', value: `${author}`, inline: true },
                    { name: 'In:', value: `#${msgChan}`, inline: true },
                    { name: 'Content', value: `${content}` },
                )
                .setThumbnail("https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg")
                .setTimestamp()
                .setFooter({ text: `by ${userName}`, iconURL: `${userIcon}` });

            logChann.send({ embeds: [logMsg] });
        }
        deleteMsg();
    }
};