const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const rawdata = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(rawdata);
const consturl = 'https://twitch.tv/shyybi';

const checkAndSendMessage = async (client, channelId, embed, title) => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
        console.log(`Le salon avec l'ID ${channelId} n'existe pas.`);
        return;
    }

    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();

    if (lastMessage && lastMessage.embeds[0] && lastMessage.embeds[0].title === title) {
        console.log(`Le message avec le titre "${title}" est déjà présent dans le salon.`);
        return;
    } else {
        console.log(`Le message avec le titre "${title}" n'est pas présent dans le salon.`);
        await channel.send({ embeds: [embed] });
        console.log("Message envoyé dans le salon.");
    }
};

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const rest = new REST({ version: '9' }).setToken(client.token);

        /* 
        Status du bot
        */
        let status = [
            { name: 'York Shin' },
            { name: "Valorant Project" }
        ];

        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random], {
                type: ActivityType.Competing,
                url: consturl
            });
        }, 5000);

        console.log(`${client.user.username} en ligne ! (${client.user.id}) `);
        console.log(`Discord Invite : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`);
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.slashdatas },
            );
        } catch (error) {
            console.error(error);
        }

        /* 
        Reglement Embed
        */
        const reglementEmbed = new EmbedBuilder()
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
            .setImage('https://cdn.discordapp.com/attachments/1288596185375838275/1291196182256816171/Reglement.png?ex=66ff37a7&is=66fde627&hm=86db6b237016bff0249cc32e96a3a2e34b519578adea3445b08f34cef736e0c9&');

        /*
        Ticket Embed
        */
        const ticketEmbed = new EmbedBuilder()
            .setTitle(':ticket: **Création de ticket**')
            .setColor('#0099ff')
            .setDescription("<:1_b:1288610201192108042> **__Bienvenue dans l'espace de création de ticket.__**\nLes **tickets** servent a reporter un problème ou a demander de l'aide.\nPour **créer un ticket**, cliquez sur le bouton ci-dessous.")
            .addFields(
                {
                    name: "<:1_d:1288610220200693850> **__Information importante__**",
                    value: " > Les tickets sont **limité a 1 ticket** par personne.\n > Les tickets sont **traités par ordre d'arrivée**.\n > Merci de **ne pas mentionner les membres du staff** inutilement.",
                    inline: true
                },
                {
                    name: "<:1_e:1288610252983373929> **__Sanction de ticket abusif__**",
                    value: " > Tout **abus** de ticket sera sanctionné.\n > Merci de **traiter les membres du staff avec respect**.\n > **le staff se reserve tout droit de fermer votre ticket**.",
                    inline: true
                }
            )
            .setFooter({ text: ` フ York Shin ・ Ce serveur Discord n'est pas affilié à Discord Inc.`, iconURL: client.user.displayAvatarURL() })
            .setImage('https://cdn.discordapp.com/attachments/1288596185375838275/1291196153035096164/Reglement_1qds.png?ex=66ff37a0&is=66fde620&hm=69bb2c4255a82e870cdbd0bbc16dcfea55687c3698cbde592bc40ecfa63e8733&');

        await checkAndSendMessage(client, cconfig.rules, reglementEmbed, ':scroll: Réglement du serveur York Shin.');
        await checkAndSendMessage(client, cconfig.tickets, ticketEmbed, ':ticket: **Création de ticket**');
    }
};