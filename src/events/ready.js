const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActivityType } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
const fs = require('fs');
const rawdata = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(rawdata);
const consturl = 'https://twitch.tv/shyybi';
module.exports = {
    name: 'ready',
    once: true,
    async execute(client, ready, message, channel ) {
        const rest = new REST({ version: '9' }).setToken(client.token);
        

        let status = [
            {
                name: 'York Shin',
            },
            {
                name: "Valorant Project"
            }
            
        ]
          
        setInterval(()=> {
            let random = Math.floor(Math.random() * status.length)
            client.user.setActivity(status[random], {
                    type: ActivityType.Competing,
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
        
        /* 

        WELCOME MESSAGE - Blablabla
        
        */

        const roleEmbed  = new EmbedBuilder()
        .setTitle(':scroll: Réglement du serveur York Shin.')
        .setColor('#0099ff')
        .addFields(
            { name: ":label:** ・ Préambule.**", value: " > En rejoignant le serveur York Shin, vous êtes priés de lire et de prendre conscience de nos règles afin d'éviter tout problèmes dans le futur ", inline: true },
            { name: " ", value: " ", inline: false },
            { name: ":books:** ・ Les règles de la plateforme.**", value: "```1. Respectez les Conditions d'utilisation de Discord.\n2. Respectez la Charte d'Utilisation de Communauté Discord.\n3. Familiarisez-vous avec le Centre de Sécurité Discord.```", inline: true },
            { name: " ", value: " ", inline: false },
            { name: ":detective:** ・ Confidentialité & Sécurité.**", value: "```1. Respectez les droits d'auteur du serveur.\n2. Les contenus sensibles et NSFW sont interdits.\n3. Toutes formes de publicités ou de pratiques sont interdites.\n4. Les attaques et tentatives de type 'Raids' sont interdites.\n5. Toutes formes de spam, flood, mentions abusives sont interdites.```", inline: true },
            { name: " ", value: " ", inline: false },
            { name: ":pencil:** ・ Votre comportement.**", value: "```1. La langue adaptés est le français hors Internationnal.\n2. L'utilisation des soundboards externe est interdit.\n3. Les débats civils sont permis hors débordements.\n4. Tout comportement ou propos inapproprié est interdit.\n5. Traitez tous les membres avec respect.```", inline: true },
            { name: " ", value: " ", inline: false },
            { name: ":shield:** ・ Modérations.**", value: "```1. Respectez les décisions des membres de l'équipe du Staff.\n2. Signalez tout comportement qui est problématique.\n3. Ne faite pas le travail des Staffs si vous ne l'êtes pas.\n4. Ne faite pas perdre le temps à nos équipes.\n5. Des règles non listé ici peuvent être cités.```", inline: true },
            { name: " ", value: " ", inline: false },
        )
        .setFooter({ text: ` フ York Shin ・ Ce serveur Discord n'est pas affilié à Discord Inc.`, iconURL: client.user.displayAvatarURL() })
        .setImage('https://cdn.discordapp.com/attachments/1279915290750222338/1288604129752518799/Reglement.png?ex=66fbb85d&is=66fa66dd&hm=7d42c439badd112abe9ec5a54ed6fb1e1e5f229a6966cf4c78bdc29043cad428&');
        

        const roleChannel = client.channels.cache.get(cconfig.rules);
        if(!roleChannel) return;
        roleChannel.messages.fetch({ limit: 1 }).then(messages => {
            const lastMessage = messages.first();
            if (lastMessage && lastMessage.embeds[0] && lastMessage.embeds[0].title === ':shield: Réglement du serveur York Shin.') {
                console.log("Le message de selection de role est déjà présent dans le salon.");
                return;
            }else{
                console.log("Le message de selection de role n'est pas présent dans le salon.");
                roleChannel.send({ embeds: [roleEmbed] })
            }
            console.log("Message envoyé dans le salon.");
        })








    }
};