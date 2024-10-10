const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ActivityType, Collection, Intents } = require("discord.js");
const Discord = require("discord.js");

const rawdata = fs.readFileSync('config/config.json');
const config = JSON.parse(rawdata);

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "GUILD_SCHEDULED_EVENT"],
});

client.login(config.token);
client.slashcommands = new Collection();
client.slashdatas = [];

fs.readdirSync('./src/events').forEach(async file => {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

const slashcommands = [];

fs.readdirSync('./src/commands/slash').forEach(async file => {
  const command = await require(`./src/commands/slash/${file}`);
  if (command.data && command.data.toJSON) {
    client.slashdatas.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
    console.log(`Loaded command: ${command.data.name}`);
  } else {
    console.error("L'objet est undefined ou n'a pas de méthode toJSON");
  }
});

client.once('ready', async () => {
  try {
    await client.application.commands.set(client.slashdatas);
    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

process.on("unhandledRejection", e => {
  console.log(e);
});
process.on("uncaughtException", e => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", e => {
  console.log(e);
});