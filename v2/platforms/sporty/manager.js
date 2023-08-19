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
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  // Navigate to the selected page
  await page.goto("https://www.sportybet.com/gh/");

  //login here
  loginManager.login(page);
  page.waitForTimeout(5000).then(() => {
    Polaris.architect(page);
    res.send("polaris activated");
    setInterval(initBetting,120000,page) 
  });
};

function initBetting(page){
 page.reload().then(()=>Polaris.architect(page))

}
module.exports = sportyManager;
