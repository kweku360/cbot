//implementation of a account to a betting platform feature
var { startBrowser } = require("../../config/browser");
var loginManager = require("./login/login");
var BetShoreAll = require("./strategies/betshore/all");
var Polaris = require("./strategies/polaris");
var sportyManager = {};

sportyManager.betShoreAll = async (req, res) => {
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  // Navigate to the selected page
  await page.goto("https://www.sportybet.com/gh/");

  //login here
  loginManager.login(page);
  page.waitForTimeout(5000).then(() => {
    BetShoreAll.architect(page);
    res.send("hello");
  });
};

sportyManager.polaris = async (req, res) => {
  activate();
  setInterval(activate,90000,res) 
};

async function activate(res){
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  // Navigate to the selected page
  await page.goto("https://www.sportybet.com/gh/");

  //login here
  loginManager.login(page);
  
  page.waitForTimeout(5000).then(() => {
    Polaris.architect(page);
    console.log("polaris activated")
    // res.send("polaris activated");
    setInterval(closeSession,80000,browserObject) 
  });
}
function initBetting(page){
 page.reload().then(()=>Polaris.architect(page))

}
async function closeSession(browserObject){
  await browserObject.close()
 
 }
module.exports = sportyManager;
