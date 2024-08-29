var StdResponse = require("../managers/log/stdresponse");
BetShore = {};

BetShore.run = (req,type="api") =>{
  // console.log(req)
 let betAmt = req.betamt;
 let lossPercent = req.losspercent;
 let drawlossPercent = req.drawlosspercent;
 let middleBetAmtLoss = betAmt - ((drawlossPercent / 100) * betAmt);
 let betAmtLoss = betAmt - ((lossPercent / 100) * betAmt);
 let home = parseFloat(req.home)
 let draw = parseFloat(req.draw)
 let away = parseFloat(req.away)

 let oddsArr = [home,draw,away]

 oddsArr.sort((a, b) => a - b);
//  console.log(oddsArr)

 //k is the ant to bet on middle value(market will be determind later)
 let k = (middleBetAmtLoss / oddsArr[1]) //Math.floor(betAmtLoss / oddsArr[1]); 
 

 //l is the ant to bet on highest value(market will be determind later)
 let l = (betAmtLoss / oddsArr[2]) //Math.floor(betAmtLoss / oddsArr[2]);


//j is the ant to bet on lowest value
 let j = betAmt - (k + l)

 //m is value of lowest bet (winnable)
 let m = j * oddsArr[0];
 //n is value of middle bet (less winnable)
 let n = k * oddsArr[1];

  //n is value of highest bet (least winnable)
  let p = l * oddsArr[2];
 if(type === "api")
  {return BetShore.showOutput(m,n,p,j,l,k,req);}

  return [j.toFixed(2),k.toFixed(2),l.toFixed(2),m.toFixed(2)];
}

// {
//   odd: '3.89',
//   gameIndex: 2,
//   payload: [ '1.43', '1.09', '0.48', '3.89' ],
//   homeodd: 2.72,
//   drawodd: 3.11,
//   awayodd: 2.76,
//   leagueId: 4
// }
const calculatePad = (winamt,winbetamt,
  drawbetamt,betAmt,awayodd,homeodd,drawodd,awaybetamt)=>{
    console.log(drawbetamt,betAmt)
let expBetAmt = 0.50;
//calculate drawbet pad
let drawBetPad = drawbetamt - (betAmt/drawodd);
let homeBetPad = winbetamt - ((winamt- expBetAmt)/ homeodd)
let totalBetPad = drawBetPad + homeBetPad + awaybetamt
console.log(awayodd*totalBetPad,betAmt)
let betloss = betAmt - (awayodd * totalBetPad)

 return {
  drawBetPad,
  homeBetPad,
  totalBetPad,
  betloss
 }
}

BetShore.showOutput = (winamt,lsamt,hsamt,winbetamt,lsbetamt,hsbetamt,req) =>{
  const outcome = {
      "win_amount": winamt.toFixed(2),
      "low_shore_amt":lsamt.toFixed(2),
      "high_shore_amt": hsamt.toFixed(2),
      "win_betamt": winbetamt.toFixed(2),
      "low_shore_betamt":lsbetamt.toFixed(2),
      "high_shore_betamt": hsbetamt.toFixed(2),
      "BetPad" : calculatePad(winamt.toFixed(2),winbetamt.toFixed(2),
      hsbetamt.toFixed(2),req.betamt,req.away
        ,req.home,req.draw,lsbetamt)
  }
  return StdResponse("true", outcome);
}

module.exports = BetShore;