var pageNavigate = require("./pagenavigation");
var Process = require("./process");

var BenHur = {};

const betArr = [];
BenHur.architect = async (page) => {
  try{
  // await page.waitForTimeout(5000).then(async () => {
  //   Process.pickGameUtd(page);
  // })
  await Process.pickGameUtd(page);
  // await page.waitForTimeout(5000).then(async () => {
  //   Process.pickVGame(page)
  // })
}catch(e){
  console.log("index.js : BenHur.Architect Error");
  console.log(e.toString());
}

};

module.exports = BenHur;