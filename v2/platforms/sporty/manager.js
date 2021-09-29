//implementation of a account to a betting platform feature
var { startBrowser } = require("../../config/browser");
var loginManager = require("./login/login");
var BetShoreAll = require("./strategies/betshore/all");
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

// function initBetting(page){
//     logManager.setIteration();
//     logManager.setConsoleIteration();
//  page.reload().then(()=>betArchitect.architect(page))

// }
module.exports = sportyManager;
