var StdResponse = require("../managers/log/stdresponse");
theArb = {}

theArb.run = (req)=>{
let bookieAHigh = req.bookieonehigh
let bookieALow = req.bookieonelow

let bookieBHigh = req.bookietwohigh
let bookieBLow = req.bookietwolow

let aHighPercentile = (1/bookieAHigh)* 100;
let alowPercentile = (1/bookieALow)* 100;

let bHighPercentile = (1/bookieBHigh)* 100;
let blowPercentile = (1/bookieBLow)* 100;



let aMarketMargin =  aHighPercentile + alowPercentile;
let bMarketMargin =  bHighPercentile + blowPercentile;

let arbMM = alowPercentile + bHighPercentile;

return showOutcome(aMarketMargin,bMarketMargin,arbMM)
}

function showOutcome (aMM,bMM,arbMM){
    const outcome = {
        "Bookie_A_Market_Margin":aMM,
        "Bookie_B_Market_Margin":bMM,
        "Arb_Market_Margin":arbMM,
    }
    return StdResponse("true", outcome);
}


module.exports = theArb;