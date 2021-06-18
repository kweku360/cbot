/*
* BetManager
* Manages all betting Platforms
* @kwekukankam - chancebot 2021
*/
var { startBrowser,getCurrentPage } = require("../../managers/app/browser");
var sportyManager = require("../../platforms/sporty/manager");
var betwayManager = require("../../platforms/betway/manager");
var dotenv = require("dotenv");
dotenv.config();
bettingResource = {};


bettingResource.startBetting = async (req, res) => {
    //init betting platform (sporty for now)
    
    switch(process.env.PLATFORM) {
        case "sporty":
            sportyManager.startBetting();
          break;
        case "betway":
            betwayManager.startBetting();
          break;
        default:
          // code block
      }
    

   res.send({"Status": "Betting Started"})
};

module.exports = bettingResource;
