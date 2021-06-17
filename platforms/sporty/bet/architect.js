var pageClicks = require("./live/pageclicks");
var gamePicker = require("./live/gamepicker");
var midOdds = require("./strategies/midodds");
var marketPicker = require("./live/marketpicker")

betArchitect = {};

const betArr = [];
betArchitect.architect = async (page) => {
    pageClicks.clickLiveBet(page);
    pageClicks.clickMultipleBet(page);
    //pick best strategy
    // gamePicker.pickGame(page);
    midOdds.pickGame(page);
    // page.waitForTimeout(1000).then(()=>marketPicker.pickMarket(page))
    
}


module.exports = betArchitect;