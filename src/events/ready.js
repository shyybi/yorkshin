const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActivityType } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
const fs = require('fs');
const rawdata = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(rawdata);
const consturl = 'https://twitch.tv'
module.exports = {
    name: 'ready',
    once: true,
    async execute(client, ready, message, channel ) {
        const rest = new REST({ version: '9' }).setToken(client.token);
        

        let status = [
            {
                name: 'Shyybre',
            },
            {
                name: "test"
            }
            
        ]
          
        setInterval(()=> {
            let random = Math.floor(Math.random() * status.length)
            client.user.setActivity(status[random], {
                    type: ActivityType.Playing,
                    url: consturl
                }
                )
        }, 5000)

        console.log(`${client.user.username} en ligne ! (${client.user.id}) `)
        console.log(`Discord Invite : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`)
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.slashdatas },
            );
        } catch (error) {
            console.error(error);
        }
        





        const roleEmbed  = new EmbedBuilder()
        .setTitle('aa')
        .setDescription("aa")
        .setColor('#0099ff')
        .addFields(
            { name: ":1_a: Réglement du serveur York Shin.", value: " En rejoignant le serveur York Shin, vous êtes priés de lire et de prendre conscience de nos règles afin d'éviter tout problèmes dans le futur ", inline: true },
            { name: ":books: ・ Les règles de la plateforme.", value: "```1. Respectez les Conditions d'utilisation de Discord.\n2. Respectez la Charte d'Utilisation de Communauté Discord.\n3. Familiarisez vous avec le Centre de Sécurité Discord.```", inline: true },
            { name: " ", value: " ", inline: false },
            { name: 'Notification SkyBlock', value: '**Notification UHC**', inline: true },
            { name: '☁️', value: '🍏', inline: true },
            { name: " ", value: " ", inline: false },
        )

        const roleChannel = client.channels.cache.get(cconfig.rules);
        if(!roleChannel) return;
        roleChannel.messages.fetch({ limit: 1 }).then(messages => {
            const lastMessage = messages.first();
            if (lastMessage && lastMessage.embeds[0] && lastMessage.embeds[0].title === 'Selection de role') {
                console.log("Le message de selection de role est déjà présent dans le salon.");
                return;
            }
        
            roleChannel.send({ embeds: [roleEmbed] }).then(msg => {
                try {
                    msg.react('☁️');
                    msg.react('🍏');
                }
                catch (error) {
                    console.error('Impossible de réagir au message.');
                }
            });
            console.log("Message envoyé dans le salon.");
        }).catch(console.error);

    }
};