//implementation of a account to a betting platform feature
var { startBrowser } = require("../../config/browser");
const puppeteer = require("puppeteer");
var loginManager = require("./login/login");
var BetShoreAll = require("./strategies/betshore/all");
var Polaris = require("./strategies/polaris");
var Benhur = require("./strategies/benhur");
var Quovadis = require("./strategies/quovadis");
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
  setInterval(activate, 90000, res)
};

sportyManager.benhur = async (req, res) => {
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  const iPhone = puppeteer.devices["iPhone 6"];
  await page.emulate(iPhone);
  //login here
  // loginManager.login(page);


  await page.goto("https://www.sportybet.com/gh/m/instant-virtuals");
  // await page.waitForTimeout(3000)
  loginManager.instantVirtualLogin(page);
  // page.waitForTimeout(5000).then(async () =>  {
  //   await page.reload();

  // });

  page.waitForTimeout(5000).then(() => {
    Benhur.architect(page);
    console.log("BenHur activated")
     res.send("Benhur activated");
  });
};

sportyManager.arsenal = async (req, res) => {
  activate();
  setInterval(activate, 90000, res)
};
sportyManager.quoVadis = async (req, res) => {
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  const iPhone = puppeteer.devices["iPhone 6"];
  await page.emulate(iPhone);

  // Navigate to the selected page
  await page.goto("https://www.sportybet.com/gh/");
  //login here
  loginManager.loginMobile(page);
  page.waitForTimeout(5000).then(() => {
    Quovadis.architect(page);
    res.send("Quo vadis Activated");
  });
}
async function activate(res) {
  let browserObject = await startBrowser();
  let page = await browserObject.newPage();
  // Navigate to the selected page
  await page.goto("https://www.sportybet.com/gh/");

  //login here
  loginManager.login(page);

  page.waitForTimeout(5000).then(() => {
    Polaris.architect(page);
    console.log("polaris activated");
    console.log(res);
    //res.send("polaris activated");
    //setInterval(closeSession, 80000, browserObject)
  });
}
function initBetting(page) {
  page.reload().then(() => Polaris.architect(page))

}
async function closeSession(browserObject) {
  await browserObject.close()

}
module.exports = sportyManager;
