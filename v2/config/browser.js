const puppeteer = require("puppeteer");

let page = null;

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true
    });
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
