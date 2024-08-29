//implementation of a account to a betting platform feature
var { startBrowser,getCurrentPage } = require("../../managers/app/browser");
var loginManager = require("./login/login");
var betArchitect = require("./bet/architect");
var logManager = require("../../managers/log/architect");
sportyManager = {};


sportyManager.startBetting = async () => {
    let browserObject = await startBrowser();
    let page = await browserObject.newPage();
    // Navigate to the selected page
    await page.goto('https://www..com/gh/')
  
    // await page.setViewport({ width: 1920, height: 912 })
    //login here
    loginManager.login(page);
    //start bet process after login

    page.waitForTimeout(5000).then(()=>{
        logManager.setIteration();
        logManager.setConsoleIteration();
        betArchitect.architect(page);
        setInterval(initBetting,180000,page) 
    })
    logArchitect.addConsoleItem({"msg":"Started Betting Process"});
};

function initBetting(page){
    logManager.setIteration();
    logManager.setConsoleIteration();
 page.reload().then(()=>betArchitect.architect(page))
    
}
module.exports = sportyManager;