const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('.'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};