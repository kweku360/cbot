const puppeteer = require("puppeteer");
var dotenv = require("dotenv");
dotenv.config();

let page = null;
let browserInstance;

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    if (process.env.ENVIRONMENT === "development") {
      browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--disable-setuid-sandbox", "--password_manager_enabled=false"],
        ignoreHTTPSErrors: true,
      });
    }

    if (process.env.ENVIRONMENT === "production") {
      browser = await puppeteer.launch({
        headless: false,
        executablePath: "/usr/bin/chromium-browser",
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      });
    }
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }

  return browser;
}
function checkInstance(){
  if(browserInstance){
    return true;
  }else{
    return false;
  }
}
async function closeInstance(){
  if(browserInstance){
  await pageInstance.close()
  let browserObject = await getPuppeteerInstance();
  await browserObject.close();
  browserInstance = null;
    return
  }else{
    return
  }
}
async function getPuppeteerInstance() {
  if (!browserInstance) {
    if (process.env.ENVIRONMENT === "development") {
      browserInstance = puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--disable-setuid-sandbox","--disable-notifications", "--password_manager_enabled=false"],
        ignoreHTTPSErrors: true,
      });
    }   

    if (process.env.ENVIRONMENT === "production") {
      browserInstance = puppeteer.launch({
        protocolTimeout: 60000,  
        headless: true,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      });
    }     
  }        

  return browserInstance;
}
 
let pageInstance;

async function getPageInstance(browser) {
  if (!pageInstance) {
    pageInstance = await browser.newPage();
  }

  const pages = await browser.pages();
  for (const page of pages) {
    if (page !== pageInstance) {
      await page.close();
    }
  }

  return pageInstance;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function envBuilder(port,value){
  const v= `${value}_${port}`
  console.log(v)
  return process.env[v];
}
module.exports = {
  envBuilder,
  startBrowser,
  delay,
  checkInstance,
  closeInstance,
  getPuppeteerInstance,
  getPageInstance,
};
