//implementation of a account to a betting platform feature
var {
  startBrowser,
  delay,
  getPuppeteerInstance,
  getPageInstance,
} = require("../../../config/browser");
const puppeteer = require("puppeteer");
var loginManager = require("../login/login");
const AviatorOne = require("./aviatorone");
var aviatorManager = {};

aviatorManager.aviate = async (req, res) => {
  activate(res);
  //activateParimatch(res);
  // setInterval(activate, 90000, res)
};

async function activate(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser");
    // Navigate to the selected page
    //const recorder = await page.screencast({path: 'recording.webm'});
    await page.goto("https://www.sportybet.com/gh/");
    // console.log("site opend")
    await loginManager.loginMobile(page);
    await delay(2000);
    //  await recorder.stop(); 
    await page.goto("https://www.sportybet.com/gh/sportygames/lobby");
    await delay(6000);
    AviatorOne.architect(page);
    if (!res.headersSent) {
      res.send("Aviator online");
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

async function activateBetway(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser - Betway");
    // Navigate to the selected page
    //const recorder = await page.screencast({path: 'recording.webm'});
    // await page.goto("https://www.betway.com.gh/");
    await page.goto("https://www.betway.com.gh/lobby/casino");

    // console.log("site opend")
    await loginManager.loginBetway(page);
    await delay(2000);
    await page.waitForSelector(
      "div:nth-child(1) > div > .scroller-casino > .overflow-hidden:nth-child(2) > .relative > .relative > .relative > .absolute:nth-child(2)"
    );
    await page.click(
      "div:nth-child(1) > div > .scroller-casino > .overflow-hidden:nth-child(2) > .relative > .relative > .relative > .absolute:nth-child(2)"
    );
    await delay(2000);
    await page.waitForSelector(
      ".modal-content > .modal-body > .mx-1 > #close-toast > img"
    );
    await page.click(
      ".modal-content > .modal-body > .mx-1 > #close-toast > img"
    );
    await delay(2000);
    AviatorOne.architect(page);
    if (!res.headersSent) {
      res.send("Betway Aviator online");
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

async function activateParimatch(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser - Parimatch");
    await page.goto("https://parimatch.com.gh/");
    await delay(2000);
    await loginManager.loginParimatch(page);
    await delay(3000);
    await page.waitForSelector(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );
    await page.click(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );

    AviatorOne.architect(page);
    if (!res.headersSent) {
      res.send("Parimatch Aviator online");
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

async function activateBet22(res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser - Parimatch");
    await page.goto("https://parimatch.com.gh/");
    await delay(2000);
    await loginManager.loginParimatch(page);
    await delay(3000);
    await page.waitForSelector(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );
    await page.click(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );

    AviatorOne.architect(page);
    if (!res.headersSent) {
      res.send("Parimatch Aviator online");
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

module.exports = aviatorManager;
