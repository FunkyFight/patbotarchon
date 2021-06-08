const Discord = require('discord.js');
const { reject, first } = require('lodash');
const { JsonDB } = require('node-json-db');
const { resolve } = require('path');

const config = require('../config.json')

const pe = require('../modules/ProfileEditor')

class PatRequest {

    /**
     * Create A Pat Request
     * @param {Discord.Client} client Client of the bot
     * @param {*} command Command sent by user 
     * @param {*} args Parameters sent in command by user
     * @param {Discord.Message} message Discord Message
     * @param {Discord.User} fidele Target who will get the request
     */
    constructor(client, command, args, message, fidele) {
        this.client = client;
        this.command = command;
        this.args = args;
        this.message = message;
        this.fidele = fidele;
    }


    /**
     * Send a request and return for what reason user should have a pat
     */
    getPatRequest() {
        return new Promise((resolve, reject) => {
            this.fidele.send({embed: {
                "title": "L'Archon Pat va distribuer ses pats !",
                "description": "Je suis le fidèle serviteur de l'Archon Pat et je suis là pour récolter ses demandes de pat.\nRéagissez <a:pat:850605068436111371> pour obtenir un pat !",
                "color": 10739467
            }}).then(msg => {
                console.log("{PatRequest} New Pat Request sent to " + this.fidele.username)
                msg.react('850605068436111371');
    
                const filter = (reaction, user) => {
                    return ['pat'].includes(reaction.emoji.name) && user.id === this.fidele.id;
                };
    
                msg.awaitReactions(filter, {errors: ['time'], max: 1, time: 7200000})
                .then(collected => {
                    var reaction = collected.first();
                    
                    if(reaction.emoji.name == "pat") {
                        var channel = msg.channel;
    
                        msg.delete();
                        channel.send({embed: {
                            "title": "Veuillez indiquer la raison de votre Pat",
                            "description": "Indiquez en **un message** pourquoi vous méritez un pat =W=",
                            "color": 10739467,
                            "image": {
                              "url": "https://media.tenor.com/images/a89d09ecb23b324d9d894565d1bd8d7d/tenor.gif"
                            },
                            "thumbnail": {
                              "url": "https://media1.tenor.com/images/d5da5398e5a193120690d0f0ca64d2ed/tenor.gif?itemid=8661798"
                            }
                        }}).then(msg => {
                            channel.awaitMessages(m => m.author.id === this.fidele.id, {max: 1, errors: ['time'], time: 7200000})
                            .then(usermessage => {
                                var firstmsg = usermessage.first();
                                msg.edit({embed: {
                                    "title": "Demande de pat envoyée",
                                    "description": `Raison : ${firstmsg.content}`,
                                    "color": 10739467,
                                    "footer": {
                                      "text": "Clémence envoie ce genre de GIF à l'Archon Pat pendant qu'il développe le bot."
                                    },
                                    "image": {
                                      "url": "https://media1.tenor.com/images/15f7b39a6f5ce0c42e5d55dcc283ba5b/tenor.gif?itemid=18061068"
                                    }
                                  }})

                                  console.log("{PatRequest} Pat Request of " + this.fidele.username + " sent with reason " + firstmsg.content)
                                
                                resolve(firstmsg.content)
                            }).catch(error => {
                                console.log("A User failed pat request !")
                                reject(error);
                            })
                        })
                        
    
                       
                    }
                })
            })
        })
        
    }

    /**
     * Obtenir la confirmation de l'Archon
     */
    getArchonConfirm(reason) {

        return new Promise((resolve, reject) => {


            var result = [];

            const archon = this.client.users.cache.find(u => u.id === config.archonid);

            const filter = (reaction, user) => {
                return ['RUBY', 'pat', 'diamond', 'x_'].includes(reaction.emoji.name) && user.id === archon.id;
            };
    
            archon.send({embed: {
                "title": `Nouvelle demande de Pat de ${this.fidele.username}`,
                "description": "Réagissez <a:diamond:851488508334178335> pour un pat de félicitation.\nRéagissez <a:RUBY:695297225840132188> pour un pat simple.\nRéagissez <a:pat:850605068436111371> pour un pat d'encouragement.\nRéagissez <:x_:851500423940014090> pour refuser la demande de pat",
                "color": 10739467,
                "fields": [
                  {
                    "name": "Raison du Pat",
                    "value": `${reason}`
                  }
                ]
            }}).then(msg => {
                msg.react('851488508334178335')
                msg.react('850605068436111371')
                msg.react('695297225840132188')
                msg.react('851500423940014090')
    
                console.log("{PatRequest} Awaiting reaction for pat request of " + this.fidele.username)
                msg.awaitReactions(filter, {max: 1, time: 7200000, errors: ['time']})
                .then(c => {
                    var reaction = c.first();
                    var confirm = null;
                    
                    switch(reaction.emoji.id) {
                        case "851488508334178335":
                            confirm = patsType.CONGRATULATION;
                            pe.addPoints(this.fidele, 100)
                            msg.delete()
                            break;
                        case "850605068436111371":
                            confirm = patsType.NORMAL;
                            pe.addPoints(this.fidele, 50)
                            msg.delete()
                            break;
                        case "695297225840132188":
                            confirm = patsType.HEARTEANING;
                            pe.addPoints(this.fidele, 20)
                            msg.delete()
                            
                            break;
                        case "851500423940014090":
                            msg.delete()
                            this.sendPat(patsType.NOPAT, null)
                            return;
                    }

                    result[0] = confirm;

                    console.log("{PatRequest} Asking Pat URL of " + this.fidele.username)
                    archon.send("URL du pat").then(url => {
                        url.channel.awaitMessages(m => m.author.id == archon.id, {max: 1, errors: ['time'], time: 7200000})
                        .then(r => {
                            result[1] = r.first().content;
                            resolve(result)
                        })
                    })

                    console.log("{PatRequest} Pat sent to " + this.fidele.username)
                    
                    
                })
                .catch(error => {
                    reject(error)
                })
            })
        })
    }
    
    /**
     * Send pat sent by Archon Pat
     * @param {patsType} patType 
     */
    sendPat(patType, url) {

        var type = null;
        var amount = 0;
        switch(patType) {
            case patsType.CONGRATULATION:
                type = "pat de félicitation"
                amount = 100;
            case patsType.NORMAL:
                type = "pat"
                amount = 50;
            case patsType.HEARTEANING:
                type = "pat d'encouragement"
                amount = 35;
        }

        if(patType != 0) {
            this.fidele.send({embed: {
                "title": `Vous avez reçu un ${patType} !`,
                "description": `+ ${amount} points pats`,
                "color": 11860480,
                "image": {
                  "url": url
                }
            }})
        } else {
            this.fidele.send({embed: {
                "title": `<:x_:851500423940014090> Votre demande de pat a été refusée. <:x_:851500423940014090>`,
                "description": `Aucun gain de point pat.`,
                "color": 13843773
            }})
        }     
    }
}

const patsType = {
    NOPAT: 0,
    CONGRATULATION: 1,
    NORMAL: 2,
    HEARTEANING: 3

}

exports.PatRequest = PatRequest;