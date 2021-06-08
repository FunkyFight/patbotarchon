const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')
const { MessageEmbed } = require('discord.js');

const { Database } = require("ark.db");
const db = new Database();

module.exports = {
    name: "leaderpat", //neded
    category: "Main",
    description: "Les personnes avec le plus de points pat !",
    usage: "!example",
    run: async function (client, command, args, message) {


        
        var points = [];

        var profiles = db.get('users');
        var desc = "";

        for(i = 0; i < profiles.length; i++) {
            points.push(profiles[i].patPoints);
        }

        points.sort(sortNumbers);

        for(i = 0; i < points.length; i++) {
            for(j = 0; j < profiles.length; j++) {
                if(points[i] == profiles[j].patPoints) {
                    
                    desc += `${i+1} — ${profiles[j].username} : ${points[i]} Points Pat\n`
                    profiles.splice(j, 1);
                }
            }
        }

        message.channel.send({embed: {
            "title": "Top des meilleur.es humain.es",
            "description": desc,
            "color": 11860480
          }})

        
        
    }
}


function sortNumbers(a, b) {
    return b - a;
}
