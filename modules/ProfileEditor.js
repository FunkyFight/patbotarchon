
const Discord = require('discord.js')
const Database = require("@replit/database")


addPoints("Test", 5)

/**
 * 
 * @param {Discord.User} fidele
 * @param {.} points
 */
function addPoints(fidele, points) {
    const db = new Database();
    
    
    
    

    /*
    var index = null;

    for(i = 0; i < users.length; i++) {
        if(users[i].userid == fidele.id) {
            index = i;
        }
    }

    if(index == null) {
        users.push({
            "userid": fidele.id,
            "patPoints": points,
            "username": fidele.username
        })
        db.set('users', users);
    } else {
        
        var lastPoints = users[index].patPoints;
        users[index] = {
            "userid": fidele.id,
            "patPoints": lastPoints + points,
            "username": fidele.username
        }
        db.set('users', users);
    }

    console.log('[PROFILEEDITOR] Added ' + points + " pat points to " + fidele.username + " account.");
    */
}

exports.addPoints = addPoints;