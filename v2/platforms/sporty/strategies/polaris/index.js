var pageNavigate = require("./pagenavigation");
var Process = require("./process");

var Polaris = {};

const betArr = [];
Polaris.architect = async (page) => {
  pageNavigate.toLiveBet(page);
  pageNavigate.toMultipleBet(page);
  await page.waitForTimeout(5000).then(async () => {
    pageNavigate.toVFootball(page);
  })
  await page.waitForTimeout(5000).then(async () => {
    Process.pickVGame(page)
  })

};

module.exports = Polaris;