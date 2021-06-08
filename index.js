const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: Discord.Intents.PRIVILEDGED }});
const cmdhandler = require('@tomdev/discord.js-command-handler');

var handler = new cmdhandler(client, "/commands", "-")

const { Database } = require("ark.db");
const db = new Database();

if(db.get('users') == null) {
  db.set('users', [])
}


//handle command on message event
client.on("message", (message) => {
    
    if (!message.guild) return;
    handler.handleCommand(message)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('ODUwNDYyMzQ2MDk3ODUyNDg2.YLqEyA.8I2h7Uiux5GppOvokOrnq_YdyTs');

//Keeping server alive
const keepAlive = require('./server.js');
keepAlive();
