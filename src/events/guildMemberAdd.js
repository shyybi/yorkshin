const { ActivityType, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const channel = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channel);
const role = fs.readFileSync('config/roles.json');
const rconfig = JSON.parse(role)
module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member, client) {
        const channel = member.guild.channels.cache.find(chnl => chnl.id === cconfig.welcome);
        const imageEmbed = "https://cdn.discordapp.com/attachments/1035693937383452775/1169637329095377066/anime-welcome.png?ex=655620a6&is=6543aba6&hm=b3427b8d4390fba564962f79fb16449699987ec2aeb3bc30449ba15aedac6006&"
        console.log(channel)
        const roleId = rconfig.membre
        const roleAdd = member.roles.add(roleId).catch(console.error);
        const logChann = member.guild.channels.cache.find(chnl => chnl.id === cconfig.log);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Reglement')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1279915290750222338')
                .setEmoji(':books:'),
            new ButtonBuilder()
                .setLabel('Informations')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1288930086539628594')
                .setEmoji(':books:'),
            new ButtonBuilder()
                .setLabel("Besoin d'aide")
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1288842550697787474')
                .setEmoji(':hand_splayed:')
        );

        member.send({
            content: `Bienvenue sur York Shin, ${member.user.username} ! Nous sommes ravis de t'accueillir parmi nous. \nN'hésitez pas à lire le règlement et à demander de l'aide si vous en avez besoin. \nhttps://discord.gg/fJZWGA22mV`,
            components: [row]
        }).catch(error => console.error("Erreur lors de l'envoi du MP:", error));

        const welcome = new EmbedBuilder()
            .setColor('#d66b7b')
            .setTitle('Oh un nouveau personnage fait son apparition')
            .setDescription(`Bienvenue sur York Shin ${member} !` )
            .setThumbnail(member.user.displayAvatarURL())
        
            channel.send({ content:`:wave: **Bienvenue** ${member} sur **York Shin** `,embeds: [welcome], components: [row] }).catch(console.error);
            channel.send({ content: imageEmbed }).catch(console.error);

        if (roleAdd) {
            logChann.send(`Role <**MEMBER**>.id=**${roleId}** added to <@${member.user.id}>`);
        } else {
            logChann.send(`Role <**MEMBER**>.id=**${roleId}** not added to <@${member.user.id}> due to error, please check the logs`);
        }        
    },
};