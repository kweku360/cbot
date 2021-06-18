var dotenv = require("dotenv");

dotenv.config();
accountResource = {};


accountResource.accountBalance = async (page) => {
    // /we refresh balance first
    await page.click('#j_refreshBalance')
   const balance = await page.waitForTimeout(5000).then(async () => {
        const checkBalance = await page.evaluate(() => {
            const wrapper = document.querySelector(`#j_balance`)
            if (wrapper != null) {
                let v = wrapper.innerHTML.substring(3);
                v = parseFloat(v);
                if (isNaN(v)) {
                    return 0
                } else {
                    return v
                }
            } else {
                return 0;
            }
        });
        return checkBalance;
    })
    // console.log(balance);
    return balance
};


accountResource.BetBalanceVerify = async (page) => {
    let balverify = {}
    const currentbalance = await accountResource.accountBalance(page);
    let openingbalance = process.env.OPENING_BET //initial opening balance
    const betvalue = process.env.MIDODD_BETAMT //amount set for a single bet
    let bCount = await betCount(page);
    const totalbetamt = betvalue * bCount;
    const amtavailable = currentbalance + totalbetamt;
    const betdiff = amtavailable - openingbalance;
    console.log({"currentBalance": currentbalance,"betdiff":betdiff})
    //iffs
    if(betdiff >= process.env.MIDODD_BETLIMIT){
        //we cease bet
        balverify = {"code":"001","betdiff":betdiff}
    }
    if(betdiff > 0 && betdiff <= process.env.MIDODD_BETLIMIT) {
        //postive result we can cease or continue
        balverify = {"code":"002","betdiff":betdiff}
    }

    if(betdiff < -8) {
        //negative result we can cease
        balverify = {"code":"001","betdiff":betdiff}
    }
    if(betdiff > -8 && betdiff <= 0) {
        //neg result but we can cease or continue
        balverify = {"code":"002","betdiff":betdiff}
    }

    return balverify;
  
  };
  
  async function betCount (page) {
     const bCount = await page.waitForTimeout(500).then(async () => {
         //click on cashout
         await page.waitForSelector('.betslip-tabs > .m-tabs-nav > .m-tabs-tab:nth-child(3) > div > span:nth-child(1)')
         await page.click('.betslip-tabs > .m-tabs-nav > .m-tabs-tab:nth-child(3) > div > span:nth-child(1)')
          const countVal = await page.evaluate(() => {
              const wrapper = document.querySelector(`.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count`)
              if (wrapper != null) {
                  console.log(wrapper)
                  let v = wrapper.innerHTML;
                  v = parseFloat(v);
                  if (isNaN(v)) {
                      return 0
                  } else {
                      return v
                  }
              } else {
                  return 0;
              }
          });
          return countVal;
      })  
      return bCount;
  };
  

module.exports = accountResource;
