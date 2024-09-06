//implementation of a account to a betting platform feature
var { startBrowser,delay,getPuppeteerInstance,getPageInstance } = require("../../config/browser");
const puppeteer = require("puppeteer");
var loginManager = require("./login/login");
var BetShoreAll = require("./strategies/betshore/all");
var Polaris = require("./strategies/polaris");
var Benhur = require("./strategies/benhur");
var Quovadis = require("./strategies/quovadis");
var sportyManager = {};

sportyManager.quoVadis = async (req, res) => {
  activateQuoVadis(res);
  setInterval(activateQuoVadis, 120000, res);
};

async function activateQuoVadis(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
  
    // Navigate to the selected page
    await page.goto("https://www.sportybet.com/gh/");
    console.log("quovd activated");
    //login here
    loginManager.loginMobile(page);
    console.log("we dey try login");
    delay(5000).then(() => {
      Quovadis.architect(page);
      if (!res.headersSent) {
        res.send('Quo vadis online');
      }
    });
  } catch (error) {
    console.log("Quo vadis Activation Error - waiting to restart");
    console.log(error);
  } 
}



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
  setInterval(activate, 90000, res);
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
    console.log("BenHur activated");
    res.send("Benhur activated");
  });
};

sportyManager.arsenal = async (req, res) => {
  activate();
  setInterval(activate, 90000, res);
};


async function activate(res) {
  try {
    let browserObject = await startBrowser();
    let page = await browserObject.newPage();
  
    // Navigate to the selected page
    await page.goto("https://www.sportybet.com/gh/");

    //login here
    loginManager.login(page);

    page.waitForTimeout(5000).then(() => {
      Polaris.architect(page);
      console.log("polaris activated");
      //setInterval(closeSession, 80000, browserObject)
    });
  } catch (error) {
    console.log("Error - waiting to restart");
  } finally {
   // await browserObject.close();
  }
}
function initBetting(page) {
  page.reload().then(() => Polaris.architect(page));
}
async function closeSession(browserObject) {
  await browserObject.close();
}
module.exports = sportyManager;
