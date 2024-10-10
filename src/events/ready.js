const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActivityType, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const rawdata = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(rawdata);
const consturl = 'https://twitch.tv/shyybi';

const reglementImage = 'src/assets/reglement.png';
const ticketImage = 'src/assets/tickets.png';
const voteImage = 'src/assets/vote.png';

const checkAndSendMessage = async (client, channelId, content, title, imagePath, components = []) => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
        console.log(`Le salon avec l'ID ${channelId} n'existe pas.`);
        return;
    }

    const messages = await channel.messages.fetch({ limit: 100 });
    const existingMessage = messages.find(msg => 
        (typeof content === 'string' && msg.content.includes(content)) ||
        (msg.embeds[0] && msg.embeds[0].title === title) ||
        msg.attachments.some(attachment => attachment.name === imagePath.split('/').pop())
    );

    if (existingMessage) {
        console.log(`Le message avec le contenu "${content}", le titre "${title}" ou l'image "${imagePath}" est déjà présent dans le salon.`);
        return;
    }

    console.log(`Le message avec le titre "${title}", le contenu "${content}" ou l'image "${imagePath}" n'est pas présent dans le salon.`);
    const attachment = new AttachmentBuilder(imagePath);
    
    if (typeof content === 'string') {
        await channel.send({ content, files: [attachment], components });
    } else {
        await channel.send({ embeds: [content], files: [attachment], components });
    }
    console.log("Message envoyé dans le salon.");
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
        console.log(`Discord Invite : https://discord.com/oauth2/authorize?client_id=${client.id}&scope=bot%20applications.commands&permissions=8`);
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
            .setTitle('<:1_a:1288605141020184666> Réglement du serveur York Shin.')
            .setColor('#d66b7b')
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
            .setFooter({ text: ` フ York Shin ・ Ce serveur Discord n'est pas affilié à Discord Inc.`, iconURL: client.user.displayAvatarURL() });

        /*
        Ticket Embed
        */
        const rowTicket = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel("Créer un ticket")
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:emoji_59:1292205988950048858>')
        );

        const ticketEmbed = new EmbedBuilder()
            .setTitle('<:emoji_59:1292205988950048858> **Création de ticket**')
            .setColor('#d66b7b')
            .setDescription("<:1_b:1288610201192108042> **__Bienvenue dans l'espace de création de ticket.__**\nLes **tickets** servent a reporter un problème ou a demander de l'aide.\nPour **créer un ticket**, cliquez sur le bouton ci-dessous.")
            .addFields(
                {
                    name: "<:1_d:1288610220200693850> **__Information importante__**",
                    value: " > Les tickets sont **limité a 1 ticket** par personne.\n > Les tickets sont **traités par ordre d'arrivée**.\n > Merci de **ne pas mentionner les membres du staff** inutilement.\n",
                    inline: true
                },
                {
                    name: "<:1_e:1288610252983373929> **__Sanction de ticket abusif__**",
                    value: " > Tout **abus** de ticket sera sanctionné.\n > Merci de **traiter les membres du staff avec respect**.\n > De plus, **le staff se reserve tout droit de fermer votre ticket**.",
                    inline: true
                }
            )
            .setFooter({ text: ` フ York Shin ・ Ce serveur Discord n'est pas affilié à Discord Inc.`, iconURL: client.user.displayAvatarURL() });

        /*
        Vote Message
        */
        const voteLink = "https://discordinvites.net/vote/1278191063265181716";
        const voteContent = " # Votez tous les 6 heures pour référencer le serveur !";

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Votez ici')
                .setStyle(ButtonStyle.Link)
                .setURL(voteLink),
        );

        await checkAndSendMessage(client, cconfig.rules, reglementEmbed, ':scroll: Réglement du serveur York Shin.', reglementImage);
        await checkAndSendMessage(client, cconfig.tickets, ticketEmbed, ':ticket: **Création de ticket**', ticketImage, [rowTicket]);
        await checkAndSendMessage(client, cconfig.votes, voteContent, 'Votez tous les 6 heures pour référencer le serveur !', voteImage, [row]);
    }
};