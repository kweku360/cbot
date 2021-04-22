var StdResponse = require("../managers/log/stdresponse");
BetShore = {};

BetShore.run = (req) =>{
  console.log(req)
 let betAmt = req.betamt;
 let lossPercent = req.losspercent;
 let betAmtLoss = betAmt - ((lossPercent / 100) * betAmt);
 let home = parseFloat(req.home)
 let draw = parseFloat(req.draw)
 let away = parseFloat(req.away)

 let oddsArr = [home,draw,away]

 oddsArr.sort((a, b) => a - b);

 //k is the ant to bet on middle value(market will be determind later)
 let k = betAmtLoss / oddsArr[1] //Math.floor(betAmtLoss / oddsArr[1]); 

 //l is the ant to bet on highest value(market will be determind later)
 let l = betAmtLoss / oddsArr[2] //Math.floor(betAmtLoss / oddsArr[2]);


//j is the ant to bet on lowest value
 let j = betAmt - (k + l)

 //m is value of lowest bet (winnable)
 let m = j * oddsArr[0];
 //n is value of middle bet (less winnable)
 let n = k * oddsArr[1];

  //n is value of highest bet (least winnable)
  let p = l * oddsArr[2];

  return BetShore.showOutput(m,n,p,j,k,l);
}

BetShore.showOutput = (winamt,lsamt,hsamt,winbetamt,lsbetamt,hsbetamt) =>{
  const outcome = {
      "win_amount": winamt,
      "low_shore_amt":lsamt,
      "high_shore_amt": hsamt,
      "win_betamt": winbetamt,
      "low_shore_betamt":lsbetamt,
      "high_shore_betamt": hsbetamt,
      "home_odd": "",
      "away_odd":"",
      "draw_odd": "",
      "win_diff": "",
      "low_shore_diff":"",
      "high_shore_diff": "",
      "shore_status":""
  }
  return StdResponse("true", outcome);
}

module.exports = BetShore;