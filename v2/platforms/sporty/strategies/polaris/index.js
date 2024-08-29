var pageNavigate = require("./pagenavigation");
var Process = require("./process");

var Polaris = {};

const betArr = [];
Polaris.architect = async (page) => {
  try{
  pageNavigate.toLiveBet(page);
  pageNavigate.toMultipleBet(page);
  await page.waitForTimeout(5000).then(async () => {
    pageNavigate.toVFootball(page);
  })
  await page.waitForTimeout(5000).then(async () => {
    Process.pickVGame(page)
  })
}catch(e){
  console.log("index.js : Polaris.Architect Error");
  console.log(e.toString());
}

};

module.exports = Polaris;