var pageClicks = require("./live/pageclicks");
var gamePicker = require("./live/gamepicker");
var marketPicker = require("./live/marketpicker")

betArchitect = {};

const betArr = [];
betArchitect.architect = async (page) => {
    pageClicks.clickLiveBet(page);
    pageClicks.clickMultipleBet(page);
    gamePicker.pickGame(page);
    // page.waitForTimeout(1000).then(()=>marketPicker.pickMarket(page))
    
}


module.exports = betArchitect;