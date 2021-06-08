const { confirm } = require("djs-reaction-collector");
const Discord = require("discord.js");

const Conf = require("../config.json");



const { PatRequest } = require('../modules/PatRequest');

module.exports = {
    name: "pat", //neded
    category: "Main",
    description: "Ask a pat!",
    usage: "-pat",
    /**
     * 
     * @param {Discord.Client} client 
     * @param {String} command 
     * @param {String[]} args 
     * @param {Discord.Message} message 
     */
    run: async function (client, command, args, message) { //needed
        
        message.delete();

        if(message.author.id != Conf.archonid)
            return;

        var role = message.guild.roles.cache.get(Conf.roleid);
        
        message.channel.send("Demande de pat envoyée à " + role.members.size + " personnes");

        role.members.forEach(user => {
            

            if(user.id != Conf.archonid || user.bot == false)
            {
                var request = new PatRequest(client, command, args, message, user.user);
                request.getPatRequest()
                .then(reason => {
                    request.getArchonConfirm(reason)
                    .then(pat => {
                        request.sendPat(pat[0], pat[1]);
                    })
                })
            }
        })
    }
}