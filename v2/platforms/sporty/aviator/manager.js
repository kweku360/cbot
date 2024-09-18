//implementation of a account to a betting platform feature
var { startBrowser,delay,getPuppeteerInstance,getPageInstance } = require("../../../config/browser");
const puppeteer = require("puppeteer");
var loginManager = require("../login/login");
const AviatorOne = require("./aviatorone")
var aviatorManager = {};

aviatorManager.aviate = async (req, res) => {
  activate(res);
 // setInterval(activate, 90000, res)
};
 
async function activate(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);

    // Navigate to the selected page
    await page.goto("https://www.sportybet.com/gh/");
    
    loginManager.loginMobile(page);
    await delay(2000) 
    await page.goto("https://www.sportybet.com/gh/sportygames/lobby");
    delay(5000).then(() => {
      AviatorOne.architect(page);
      if (!res.headersSent) {
        res.send('Aviator online');
      }
    });
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  } 
}

module.exports = aviatorManager;
