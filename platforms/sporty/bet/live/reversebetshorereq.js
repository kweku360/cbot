var StdResponse = require("../../../../managers/log/stdresponse");
ReverseBetShore = {};

ReverseBetShore.run = (req) =>{
let betAmt = parseFloat(req.betamt)
let lossPercent = parseFloat(req.losspercent)
 let home = parseFloat(req.home)
 let draw = parseFloat(req.draw)
 let away = parseFloat(req.away)
 let padAmt = 1; //bias amt for low odd - defaults to 10

 let oddsObj = {}

 //calculate draw odd
 let lossAmt = (lossPercent / 100) * betAmt;
 let drawLossAmt =  betAmt - ((lossPercent / 100) * betAmt);
 let drawOddAmt = drawLossAmt /draw; //amt to bet on the draw odd.
 let remAmt = betAmt - drawOddAmt; //the ant left for the other two odds;

 //build the draw object
 let drawObj = {
   "odd": draw,
   "betamt":drawOddAmt,
   "lossamt":lossAmt
 }
 oddsObj["draw"] = drawObj;

 //calculate bet amt on lowest odd
 let lowOdd = oddComparator(home,away,"low");
 let lowOddAmt = (betAmt + padAmt) / lowOdd[1];
//build the low odd object
let lowOddobj = {
  "odd":lowOdd[1],
  "betamt":lowOddAmt,
  "totalwin":lowOddAmt * lowOdd[1],
}
oddsObj[lowOdd[0]] = lowOddobj;

//calculate bet amt on highest amt odd
let highOdd = oddComparator(home,away,"high")
let highOddAmt = remAmt - lowOddAmt;
//validate if bet fits profit criteria
let highOddProfit = (highOdd[1] * highOddAmt ) - betAmt;
let status = "";
if(highOddProfit > 0 ){
  status = "positive"
}else{
  status = "negative"
}

//build the high odd obj
let highOddobj = {
  "odd" : highOdd[1],
  "betamt" : highOddAmt,
  "totalwin" : highOdd[1] * highOddAmt,
  "winamt" : highOddProfit,
  "status":status
}

oddsObj[highOdd[0]] = highOddobj;
 return StdResponse("true", oddsObj);
}

function sortObject(obj){
  //es8
  const sortedObject = Object.entries(obj)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  return sortedObject;
}
//compares two odds and returns higher or lover odd based;
function oddComparator(home,away,flag){
  if(home >= away){
   if(flag == "low"){
     return ["away",away];
   }else{
     return ["home",home]
   }
  }else{
    if(flag == "low"){
      return ["home",home]
    }else{
      return ["away",away]
    }
  }
}
module.exports = ReverseBetShore;