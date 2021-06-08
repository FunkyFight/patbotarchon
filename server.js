const express = require('express');
const server = express();
 
server.all('/', (req, res) => {
  res.send(`OK`)
})
 
function keepAlive() {
  server.listen(3000, () => {
      var date = new Date();
     
      console.log("Server restarted at " + (date.getHours() + 2) + "h" + date.getMinutes()) 
    });
}
 
module.exports = keepAlive;