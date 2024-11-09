var PageApi = require("./facade/pageapi");
var { delay, getPuppeteerInstance } = require("../../../config/browser");
const errors = require("bookshelf/lib/errors");
const logApi = require("./facade/db");
var dotenv = require("dotenv");

var AviatorOne = {};
let cashOutSwitch = 0;
let prevBet = 0;
let totalProfitLoss = 0;
let gameCount = 0;
let amtSet = 0;
AviatorOne.architect = async (page) => {
  try {
    await delay(4000);
    //click on aviator
    await PageApi.find("clickAviator", page);
    await PageApi.click("clickAviator", page);
    await delay(500);
    await PageApi.find("clickAviatorNext", page);
    await PageApi.click("clickAviatorNext", page);
    await delay(5000);
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

    let previousRoundCount = 0;
    let flyCount = 0;
    let balanceFlag = false;
    let currentBalance = 0;
    let killCount = 0;
    let killLimit = 10;
    let outcomeStatus = ""
    let initialBalance = await frame.$eval(".amount", (el) => el.innerHTML);
    initialBalance = parseFloat(initialBalance.trim());
    setInterval(async () => {
      let roundArr = [];
      const roundCount = await frame.evaluate(() => {
        const wrapper = Array.from(
          document.querySelectorAll(".payouts-block > .payouts")
        );
        return wrapper.length;
      });

      if (roundCount !== previousRoundCount) {
        for (let i = 1; i <= roundCount; i++) {
          let roundHistory = await frame.$eval(
            `.payouts-block > .payouts:nth-child(${i}) > .payout > .bubble-multiplier > div`,
            (el) => el.innerHTML
          );
          roundHistory = parseFloat(roundHistory.slice(0, -1));
          roundArr.push(roundHistory);
        }
        // console.log("Round count changed to:", roundCount);
        // console.log("The new Value is", roundArr[0]);
        previousRoundCount = roundCount;

        //display balance
        if (balanceFlag === true) {
          let getBalance = await frame.$eval(".amount", (el) => el.innerHTML);
          getBalance = parseFloat(getBalance.trim());
          // console.log("stakebal - ", getBalance);
          // console.log("curBal - ", currentBalance);

          if (getBalance === currentBalance) {
            // console.log("Same balance no bet made");
            // console.log("-----------------------");
            return;
          }
          if (getBalance < currentBalance) {
            // console.log("loss made - sorry");
            // console.log("initial balance - ", currentBalance);
            // console.log("Loss balance - ", getBalance);
            // console.log("-----------------------");
            outcomeStatus = "LOSS"
          }
          if (getBalance > currentBalance) {
            // console.log("WIN WIN WIN");
            // console.log("initial balance - ", currentBalance);
            // console.log("Win balance - ", getBalance);
            // console.log("-----------------------");
            outcomeStatus = "WIN"
          }
          //lets log outcome
          const roundLog = [{
            id:getRandomNumber(20000,90000),
            ts: new Date().toISOString(),
            status:outcomeStatus, //win /loss
            initialBalance:currentBalance,
            currentBalance:getBalance,
            profitlossamt:outcomeStatus == "WIN" ? Math.ceil((getBalance - currentBalance)):
            Math.ceil((currentBalance - getBalance)),
            stakeOdd:"1.1",
            outcomeOdd:roundArr[0]
          }]
          await logApi.addLog({
            id: generateId(),
            platform: process.env.PLATFORM,
            number: process.env.ACCNUMBER,
            date:new Date().toISOString(),
            data: roundLog,
          });

          //check betCount and setup kill signal
          if (killCount === killLimit) {
            //calculate exitbalance
            const exitBalance = getBalance - initialBalance;
            // console.log("-----------------------");
            // console.log("Starting Balance  - ", initialBalance);
            // console.log("Closing Balance  - ", getBalance);
            // console.log("Difference - ", exitBalance);
            // console.log("-----------------------");
            //close browser
            let browserObject = await getPuppeteerInstance();
            await browserObject.close();
          }
          killCount++;

          //reset
          balanceFlag = false;
        }

        flyCount++;
        if (flyCount === 3) {
          const stakeOutcome = await stake(page, frame);
          if (stakeOutcome === true) {
            let curbalance = await frame.$eval(".amount", (el) => el.innerHTML);
            curbalance = parseFloat(curbalance.trim());
            currentBalance = curbalance;
            //set balance checker flag
            balanceFlag = true;
            flyCount = 0;
          }
        }
      }
    }, 5000);
  } catch (e) {
    console.error("index.js : AviatorOne.Architect Error", errors);
    console.log(e.toString());
    await delay(2000);
    AviatorOne.architect(page);
  }
};

const stake = async (page, frame) => {
  //get previousBetAmt
  let currentBetAmt = await frame.$eval(".amount", (el) => el.innerHTML);
  currentBetAmt = parseFloat(currentBetAmt.trim());
  //prevBet = prevBet === 0 ? currentBetAmt : prevBet;

  prevBet = currentBetAmt;

  const autoBet = await frame.waitForSelector(
    ".controls > .navigation > .navigation-switcher > .ng-star-inserted:nth-of-type(2)"
  );
  autoBet.click();
  //await delay(500);
  const betAmt = await frame.waitForSelector(
    ".auto-game-feature > .bet-block > .spinner > .big > .input > input"
  );
  if (amtSet === 0) {
    await betAmt.click({ clickCount: 3 });
    //  await delay(500);
    const bArr = ["0.1", "0.3", "0.2", "0.4", "0.5"];
    const bAt = Math.floor(Math.random() * bArr.length);
    await betAmt.type("0.1");
    amtSet = 1;
  }
  //await delay(500);
  const betAmtConfirm = await frame.waitForSelector(
    ".cash-out-switcher > label"
  );
  await betAmtConfirm.click();
  // await delay(500);
  if (cashOutSwitch === 0) {
    const autoCashOut = await frame.waitForSelector(
      ".cash-out-switcher > .ng-valid > .input-switch"
    );
    await autoCashOut.click();
    cashOutSwitch = 1;
  }

  // await delay(500);
  const cashOutValue = await frame.waitForSelector(
    ".cashout-spinner > .ng-valid > .spinner > .input > input"
  );
  await cashOutValue.click({ clickCount: 3 });
  const bArr = ["1.3", "1.4", "1.65", "1.7", "1.55"];
  const bAt = Math.floor(Math.random() * bArr.length);
  await cashOutValue.type("1.3"); 
  // await delay(500);
  const cashOutConfirm = await frame.waitForSelector(
    ".cash-out-switcher > label"
  );
  await cashOutConfirm.click();
  //  await delay(500);
  const placeBet = await frame.waitForSelector(
    ".auto-game-feature > .buttons-block > button"
  );
  await placeBet.click();
  // console.log("-----------------");
  // console.log("bet placed");
  // console.log("-----------------");
  // await delay(10000);
  // AviatorOne.architect(page);
  return true;
};

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
const checkVolatility = (array, n, threshold, x) => {
  let count = 0;
  let passes = 0;
  for (let i = 0; i < n; i++) {
    if (array[i] > threshold) {
      count++;
    }
  }
  if (count < x) {
    return true;
  } else {
    return false;
  }
};

const generateId = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yy = String(today.getFullYear()).slice(-2);
  const formattedToday = dd + mm + yy;
  const id = formattedToday+process.env.PLATFORM+process.env.ACCNUMBER
  return id
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = AviatorOne;
//dead code
// await stake(page,frame)
// const isVolatile = checkVolatility(roundArr,3,1.2,1)
// console.log(roundArr[0] + " " + roundArr[1] + " " + roundArr[2] );
// console.log("volatile status : " ,isVolatile);
//  if(isVolatile === false) {
//   await stake(page,frame)
//  }else{
//   console.log("waiting 5 s");
//   console.log("------------------");
//   await delay(5000)
//   AviatorOne.architect(page);
//  }
// await stake(page,frame)

// if(roundArr[0] <= 20.21){
//    await stake(page,frame)
// }else{
//     await delay(5000)
//     AviatorOne.architect(page);
// }

// for (let i = 1; i <= roundCount; i++) {
//   let roundHistory = await frame.$eval(
//     `.payouts-block > .payouts:nth-child(${i}) > .payout > .bubble-multiplier > div`,
//     (el) => el.innerHTML
//   );
//   roundHistory = parseFloat(roundHistory.slice(0, -1));
//   roundArr.push(roundHistory);
// }
// console.log("count : ", roundArr.length);
// console.log(roundArr[0]);
