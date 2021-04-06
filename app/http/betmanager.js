/*
* BetManager
* Manages all betting Platforms
* @kwekukankam - chancebot 2021
*/
var { startBrowser,getCurrentPage } = require("../browser");
var sportyManager = require("../../platforms/sporty/manager");
bettingResource = {};


bettingResource.startBetting = async (req, res) => {
    //init betting platform (sporty for now)
    sportyManager.startBetting();

    // // let page = getCurrentPage();
    // let browserObject = await startBrowser();
    // let page = await browserObject.newPage();
    // // Navigate to the selected page
    // await page.goto('https://www.sportybet.com/gh/')
  
    // await page.setViewport({ width: 1920, height: 912 })
    // //login here
    // loginManager.login(page);
    // page.waitForTimeout(5000).then(()=>{
    //     betArchitect.architect(page);
    //      initBetting(page);
    //      setInterval(initBetting,120000,page) 
    // })
   

   res.send({"Status": "Betting Started"})
};

// function initBetting(page){
//     logArchitect.setIteration();
//  page.reload().then(()=>betArchitect.architect(page))
    
// }
module.exports = bettingResource;
