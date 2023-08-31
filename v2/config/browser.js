const puppeteer = require("puppeteer");
var dotenv = require("dotenv");
dotenv.config();

let page = null;

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    if(process.env.ENVIRONMENT === "development") {
      browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true
      });
    }

    if(process.env.ENVIRONMENT === "production") {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--no-sandbox","--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true
      });
    }

  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }

  return browser;
}

function setCurrentPage(currpage) {
  page = currpage;
}

function getCurrentPage() {
  if (page != null) {
    return page;
  }
}

module.exports = {
  startBrowser,
  setCurrentPage,
  getCurrentPage
};
