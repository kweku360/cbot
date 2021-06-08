/*
* BetManager
* Manages all betting Platforms
* @kwekukankam - chancebot 2021
*/
var { startBrowser,getCurrentPage } = require("../../managers/app/browser");
var sportyManager = require("../../platforms/sporty/manager");
bettingResource = {};


bettingResource.startBetting = async (req, res) => {
    //init betting platform (sporty for now)
    sportyManager.startBetting();

   res.send({"Status": "Betting Started"})
};

module.exports = bettingResource;
