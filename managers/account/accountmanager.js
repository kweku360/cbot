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
    return balance
};
accountResource.BetBalanceVerify = async (page) => {
  let openingbalance = 20 //initial opening balance
  const betvalue = 2 //amount set for a single bet


};

module.exports = accountResource;
