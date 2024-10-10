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
        const channel = member.guild.channels.cache.get(cconfig.welcome);
        if (!channel) {
            console.error("Le canal de bienvenue n'a pas été trouvé.");
            return;
        }
        console.log(channel)
        const roleId = rconfig.membre
        const roleAdd = member.roles.add(roleId).catch(console.error);
        const logChann = member.guild.channels.cache.find(chnl => chnl.id === cconfig.log);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Reglement')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1279915290750222338')
                .setEmoji('📖'),
            new ButtonBuilder()
                .setLabel('Informations')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1288930086539628594')
                .setEmoji('📚'),
            new ButtonBuilder()
                .setLabel("Besoin d'aide")
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/channels/1278191063265181716/1288842550697787474')
                .setEmoji('🖐️')
        );

        member.send({
            content: `Bienvenue sur York Shin, ${member.user.username} ! Nous sommes ravis de t'accueillir parmi nous. \nN'hésitez pas à lire le règlement et à demander de l'aide si vous en avez besoin. \nhttps://discord.gg/fJZWGA22mV`,
            components: [row]
        }).catch(error => {
            console.error("Erreur lors de l'envoi du MP:", error);
            // Tentative d'envoi du message dans le canal de bienvenue si le MP échoue
            channel.send(`${member}, nous n'avons pas pu vous envoyer un message privé. Veuillez vérifier vos paramètres de confidentialité.`).catch(console.error);
        });

        const welcome = new EmbedBuilder()
            .setColor('#d66b7b')
            .setTitle('Oh un nouveau personnage fait son apparition')
            .setDescription(`Bienvenue sur York Shin ${member} !` )
            .setThumbnail(member.user.displayAvatarURL())
        
            channel.send({ content:`:wave: **Bienvenue** ${member} sur **York Shin** `,embeds: [welcome], components: [row] }).catch(console.error);

        if (roleAdd) {
            logChann.send(`Role <**MEMBER**>.id=**${roleId}** added to <@${member.user.id}>`);
        } else {
            logChann.send(`Role <**MEMBER**>.id=**${roleId}** not added to <@${member.user.id}> due to error, please check the logs`);
        }        
    },
};