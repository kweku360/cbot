//implementation of a account to a betting platform feature
var {
  envBuilder,
  delay,
  getPuppeteerInstance,
  getPageInstance,
} = require("../../../config/browser");
var PageApi = require("./facade/pageapi");
const puppeteer = require("puppeteer");
var loginManager = require("../login/login");
const AviatorOne = require("./aviatorone");
var aviatorManager = {};

aviatorManager.aviate = async (req, res) => {
  switch (envBuilder(req.headers['x-port'],"PLATFORM")) {
    case "sporty":
      activate(req,res);
      break;
    case "parimatch":
      activateParimatch(req,res);
      break;
    case "betway":
      activateBetway(req,res);
      break;

    default:
     // activate(req,res);
      break;
  }

  //activateParimatch(res);
  // setInterval(activate, 90000, res)
};

async function activate(req,res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser");
    if (!res.headersSent) {
      res.json({ status: true, msg: "Sporty Aviator Online" });
    }
    // Navigate to the selected page
    //const recorder = await page.screencast({path: 'recording.webm'});
    await page.goto("https://www.sportybet.com/gh/");
    // console.log("site opend")
    await loginManager.loginMobile(req,page);
    await delay(2000);
    //  await recorder.stop();
    await page.goto("https://www.sportybet.com/gh/sportygames/lobby");
    await delay(6000);
    //click on aviator
    await PageApi.find("clickAviator", page);
    await PageApi.click("clickAviator", page);
    await delay(500);
    await PageApi.find("clickAviatorNext", page);
    await PageApi.click("clickAviatorNext", page);
    await delay(5000);
    AviatorOne.architect(req,page);
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error.toString());
    if (!res.headersSent) {
      res.json({ status: false, msg: "Unable to Start Aviator" });
    }
  }
}

async function activateBetway(req,res) {
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
    await delay(6000);
    console.log("site opened")
    await loginManager.loginBetway(req,page);
    await delay(4000);
    await page.goto("https://www.betway.com.gh/lobby/casino/game/aviator");
    
    // await page.waitForSelector(
    //   'div:nth-child(1) > div > .scroller-casino > .overflow-hidden:nth-child(1) > .relative > .relative > .relative > .absolute:nth-child(2)'
    // );
    // await page.click(
    //   "div:nth-child(1) > div > .scroller-casino > .overflow-hidden:nth-child(2) > .relative > .relative > .relative > .absolute:nth-child(2)"
    // );
    await delay(6000);
    await page.waitForSelector(
      ".modal-content > .modal-body > .mx-1 > #close-toast > img"
    );
    await page.click(
      ".modal-content > .modal-body > .mx-1 > #close-toast > img"
    );
     await delay(4000);
    AviatorOne.architect(req,page);
    if (!res.headersSent) {
      res.json({ status: true, msg: "Betway Aviator Online" });
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

async function activateParimatch(req,res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser - Parimatch");
    await page.goto("https://parimatch.com.gh/");
    await delay(4000);
    await loginManager.loginParimatch(req,page);
    await delay(5000);
    await page.waitForSelector(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );
    await page.click(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );
    await delay(60000);
    AviatorOne.architect(req,page);

  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
    if (!res.headersSent) {
      res.json({ status: false, msg: "Unable to s" });
    }
  }
}

async function activateBet22(req,res) {
  try {
    let browserObject = await getPuppeteerInstance();
    let page = await getPageInstance(browserObject);
    const iPhone = puppeteer.KnownDevices["iPhone 12"];
    await page.emulate(iPhone);
    console.log("starting browser - Parimatch");
    await page.goto("https://parimatch.com.gh/");
    await delay(2000);
    await loginManager.loginParimatch(req,page);
    await delay(3000);
    await page.waitForSelector(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );
    await page.click(
      ".qab > .qab__item:nth-child(3) > .qab__link > .qab__visual > img"
    );

    AviatorOne.architect(req,page);
    if (!res.headersSent) {
      res.send("Parimatch Aviator online");
    }
  } catch (error) {
    console.log("Aviator Activation Error - waiting to restart");
    console.log(error);
  }
}

module.exports = aviatorManager;
