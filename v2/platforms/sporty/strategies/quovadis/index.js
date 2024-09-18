// this is the index file for quovadis
// sheduled betting for sportybet with 
// betting stategies

var Process = require("./process");
var ThreeLine = require("./agents/threeline");
var { delay } = require("../../../../config/browser");

var QuoVadis = {};

const betArr = [];
QuoVadis.architect = async (page) => {
  try{
  await delay(500).then(async () => { 
    ThreeLine.start(page);
  })
  
}catch(e){
  console.log("index.js : QuoVadis.Architect Error");
  console.log(e.toString());
}

};

module.exports = QuoVadis;