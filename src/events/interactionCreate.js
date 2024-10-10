const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const channel = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channel);
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'ticket') {
            const guild = interaction.guild;
            const member = interaction.member;

            try {
                const existingTicket = guild.channels.cache.find(
                    channel => channel.name === `ticket-${member.user.username.toLowerCase()}` 
                );

                if (existingTicket) {
                    return await interaction.reply({ 
                        content: `Vous avez déjà un ticket ouvert : ${existingTicket}. Veuillez utiliser ce ticket existant.`, 
                        ephemeral: true 
                    });
                }

                const channel = await guild.channels.create({
                    name: `ticket-${member.user.username}`,
                    type: ChannelType.GuildText,
                    parent: cconfig.ticketCategory,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: member.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });

                const closeButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Fermer le ticket')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder()
                    .addComponents(closeButton);

                await channel.send({
                    content: `Bienvenue dans votre ticket, ${member}! \nUn membre du staff vous répondra bientôt. Si vous souhaitez fermer ce ticket, cliquez sur le bouton ci-dessous.`,
                    components: [row]
                });

                await interaction.reply({ content: `Votre ticket a été créé : ${channel}`, ephemeral: true });
            } catch (error) {
                console.error('Erreur lors de la création du ticket:', error);
                await interaction.reply({ content: "Une erreur s'est produite lors de la création du ticket. Veuillez réessayer plus tard.", ephemeral: true });
            }
        } else if (interaction.customId === 'closeTicket') {
            const confirmButton = new ButtonBuilder()
                .setCustomId('confirmCloseTicket')
                .setLabel('Confirmer la fermeture')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:1_b:1288610201192108042>');

            const cancelButton = new ButtonBuilder()
                .setCustomId('cancelCloseTicket')
                .setLabel('Annuler')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('<:1_e:1288610252983373929>');

            const row = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);

            await interaction.reply({
                content: 'Êtes-vous sûr de vouloir fermer ce ticket ? Cette action est irréversible.',
                components: [row],
                ephemeral: true
            });
        } else if (interaction.customId === 'confirmCloseTicket') {
            const channel = interaction.channel;
            await interaction.reply({ content: 'Le ticket va être fermé dans quelques secondes...', ephemeral: true });
            setTimeout(() => {
                channel.delete().catch(console.error);
            }, 5000);
        } else if (interaction.customId === 'cancelCloseTicket') {
            await interaction.reply({ content: 'Fermeture du ticket annulée.', ephemeral: true });
        }
    }
};