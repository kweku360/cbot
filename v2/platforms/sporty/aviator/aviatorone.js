var PageApi = require("./facade/pageapi");
var { delay } = require("../../../config/browser");
const errors = require("bookshelf/lib/errors");

var AviatorOne = {};
let cashOutSwitch = 0;
let prevBet = 0;
let totalProfitLoss = 0;
let gameCount = 0;
let amtSet = 0;
AviatorOne.architect = async (page) => {
  try {
    //click on aviator
    await PageApi.find("clickAviator", page);
    await PageApi.click("clickAviator", page);
    await delay(500);
    await PageApi.find("clickAviatorNext", page);
    await PageApi.click("clickAviatorNext", page);
    await delay(7000);
    //lets get the iframe
    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();

    //ger round history
    const roundCount = await frame.evaluate(() => {
      const wrapper = Array.from(
        document.querySelectorAll(".payouts-block > .payouts")
      );
      return wrapper.length;
    }); 
    let roundArr = [];
    for (let i = 1; i <= roundCount; i++) {
      let roundHistory = await frame.$eval(
        `.payouts-block > .payouts:nth-child(${i}) > .payout > .bubble-multiplier > div`,
        (el) => el.innerHTML
      );
      roundHistory = parseFloat(roundHistory.slice(0, -1));
      roundArr.push(roundHistory); 
    }
    console.log("count : ",roundArr.length);
    console.log(roundArr[0]);
     
    if(roundArr[0] <= 1.81){
       await stake(page,frame)
    }else{
        await delay(5000)
        AviatorOne.architect(page);
    }
   
     } catch (e) {
    console.error("index.js : AviatorOne.Architect Error",errors);
    console.log(e.toString());
    await delay(50000); 
    AviatorOne.architect(page);
  }  
};    

const stake =async (page,frame) =>{
    //get previousBetAmt
    let currentBetAmt = await frame.$eval(".amount", (el) => el.innerHTML);
    currentBetAmt = parseFloat(currentBetAmt.trim());
    //prevBet = prevBet === 0 ? currentBetAmt : prevBet;
    console.log("\n");
    if (currentBetAmt < prevBet) {   
      gameCount++;
      //this is a previous loss state
      console.log("-----------------------------------");
      console.log(`Gmae No. - ${gameCount}`);
      console.log("Previous game Lost");
      console.log(`current Balance - ${currentBetAmt}`);
      console.log(`Previous Balance - ${prevBet}`);
      console.log(`Total Loss - ${currentBetAmt - prevBet}`);
      console.log("-----------------------------------");
    }

    if (currentBetAmt > prevBet && prevBet !== 0) {
      //this is a previous loss state
      gameCount++;
      console.log("-----------------------------------");
      console.log(`Gmae No. - ${gameCount}`);
      console.log("Previous game Won - yaay");
      console.log(`current Balance - ${currentBetAmt}`);
      console.log(`Previous Balance - ${prevBet}`);
      console.log(`Total Win - ${currentBetAmt - prevBet}`);
      console.log("-----------------------------------");
    }

    prevBet = currentBetAmt;

    const autoBet = await frame.waitForSelector(
      ".controls > .navigation > .navigation-switcher > .ng-star-inserted:nth-of-type(2)"
    );
    autoBet.click();
    await delay(500);
    const betAmt = await frame.waitForSelector(
      ".auto-game-feature > .bet-block > .spinner > .big > .input > input"
    );
    if(amtSet === 0){
        await betAmt.click({ clickCount: 2 });
        await delay(500);
        await betAmt.type("2");

        amtSet = 1;  
    }      
    await delay(500);
    const betAmtConfirm = await frame.waitForSelector(
      ".cash-out-switcher > label"
    );  
    await betAmtConfirm.click();
    await delay(500);
    if (cashOutSwitch === 0) { 
      // await delay(240000)
      const autoCashOut = await frame.waitForSelector(
        ".cash-out-switcher > .ng-valid > .input-switch"
      );
      await autoCashOut.click();
      cashOutSwitch = 1;
    }

    await delay(500);
    const cashOutValue = await frame.waitForSelector(
      ".cashout-spinner > .ng-valid > .spinner > .input > input"
    );
    await cashOutValue.click({ clickCount: 3 });
    await cashOutValue.type("1.70");
    await delay(500); 
    const cashOutConfirm = await frame.waitForSelector(    
      ".cash-out-switcher > label"   
    );
    await cashOutConfirm.click();

    await delay(500);
    const placeBet = await frame.waitForSelector(
      ".auto-game-feature > .buttons-block > button"
    );
    await placeBet.click();

    //   await frame.evaluate(async () => {
    //     document.querySelector(".auto-game-feature > .bet-block > .spinner > .big > .input > input").value = "1.5";
    // });
    // console.log(tt);
    await delay(35000);
    AviatorOne.architect(page);   
     
}

const calculateRegression = (data) => {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    // Calculate sums for the linear regression formula
    for (let i = 0; i < n; i++) {
      sumX += i; // i is the index (0, 1, 2, ...)
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Predict the next value (for index n)
    const nextValue = m * n + b;
    return nextValue;
};

module.exports = AviatorOne;
