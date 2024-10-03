const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const channelData = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channelData);
const roleData = fs.readFileSync('config/roles.json');
const rconfig = JSON.parse(roleData);

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

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Reglement')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/channels/1278191063265181716/1279915290750222338'),
                new ButtonBuilder()
                    .setLabel('Informations')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/channels/1278191063265181716/1279915290750222338'),
                new ButtonBuilder()
                    .setLabel("Besoin d'aide")
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/channels/1278191063265181716/1279915290750222338')
            );

            const logMsg = new EmbedBuilder()
                .setColor(0x48f542)
                .setTitle('Created Message')
                .addFields(
                    { name: 'From user:', value: `${author}`, inline: true },
                    { name: 'In:', value: `#${msgChan}`, inline: true },
                    { name: 'Content', value: `${content}` }
                )
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                .setTimestamp()
                .setFooter({ text: `by ${userName}`, iconURL: `${userIcon}` });

            if (message.author.id == "1177559796975669340") {
                return;
            } else {
                if (logChann) {
                    logChann.send({embeds: [logMsg], components: [row] }).catch(console.error);
                } else {
                    console.error("logChann is undefined or null");
                }
            }
        }
        CreateMsg();
    }
};