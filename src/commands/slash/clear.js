const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre spécifié de messages.')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer (entre 1 et 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const nombre = interaction.options.getInteger('nombre');

        try {
            // Supprime les messages
            const messages = await interaction.channel.bulkDelete(nombre, true);

            // Envoie une confirmation
            await interaction.reply({
                content: `J'ai supprimé ${messages.size} message(s).`,
                ephemeral: true
            });

            // Supprime la confirmation après 5 secondes
            setTimeout(() => interaction.deleteReply(), 5000);
        } catch (error) {
            console.error('Erreur lors de la suppression des messages:', error);
            await interaction.reply({
                content: "Une erreur s'est produite lors de la suppression des messages. Assurez-vous que les messages ne datent pas de plus de 14 jours.",
                ephemeral: true
            });
        }
    },
};
