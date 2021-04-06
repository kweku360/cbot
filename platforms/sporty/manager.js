//implementation of a account to a betting platform feature
var { startBrowser,getCurrentPage } = require("./browser");
var loginManager = require("./login/login");
var betArchitect = require("./bet/architect");
var logManager = require("./log/architect");
sportyManager = {};


sportyManager.startBetting = async () => {
    let browserObject = await startBrowser();
    let page = await browserObject.newPage();
    // Navigate to the selected page
    await page.goto('https://www.sportybet.com/gh/')
  
    await page.setViewport({ width: 1920, height: 912 })
    //login here
    loginManager.login(page);
    //start bet process after login

    page.waitForTimeout(5000).then(()=>{
        betArchitect.architect(page);
        setInterval(initBetting,120000,page) 
    })
   
   console.log("here we are");
};

function initBetting(page){
    logManager.setIteration();
 page.reload().then(()=>betArchitect.architect(page))
    
}
module.exports = sportyManager;