const Conf = require("../config.json");

const { Database } = require("ark.db");
const db = new Database();

const pe = require('../modules/ProfileEditor')

module.exports = {
    name: "test", //neded
    category: "Main",
    description: "Test a server!",
    usage: "!example",
    run: async function (client, command, args, message) { //needed
        
        pe.addPoints(message.author, 100);

    }
}
