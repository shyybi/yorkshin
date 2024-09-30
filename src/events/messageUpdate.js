const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const channel = fs.readFileSync('config/channels.json');
const cconfig = JSON.parse(channel);
const role = fs.readFileSync('config/roles.json');
const rconfig = JSON.parse(role)
module.exports = {
  name: "messageUpdate",
  once: false, 
  async execute(oldMessage, newMessage, message, client) {
    function updateMsg() {
      const userName = 'Shyybi';
      const userIcon = 'https://avatars.githubusercontent.com/u/146101928?v=4';
      const logId = cconfig.log;
      const author = oldMessage.author;
      const content = oldMessage.content;
      const msgChan = oldMessage.channel.name;
      const newContent = newMessage.content;
      const logChann = oldMessage.guild.channels.cache.get(logId);

      const logMsg = new EmbedBuilder()
        .setColor(0xffe100)
        .setTitle("Updated Message")
        .addFields(
          { name: " ", value: " " },
          { name: "From User:", value: `${author}`, inline: true },
          { name: "In :", value: `#${msgChan}`, inline: true },
          { name: " ", value: " " },
          { name: " ", value: " " },
          { name: "Old Content", value: `${content}` },
          { name: "New Content", value: `${newContent}` },
          { name: " ", value: " " }
        )
        .setThumbnail("https://cdn.discordapp.com/avatars/"+ oldMessage.author.id+"/"+ oldMessage.author.avatar+".jpeg")
        .setTimestamp()
        .setFooter({ text: `by ${userName}`, iconURL: `${userIcon}` });

      logChann.send({ embeds: [logMsg] });
    }

    updateMsg();
    console.log(oldMessage.author.id)
  },
};