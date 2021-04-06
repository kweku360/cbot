var accountResource = require("../../managers/account/accountmanager");
var logArchitect = require("../../managers/log/architect");
placeBet = {}

placeBet.live = async (page, marketCountItem, outcomeValue, betAmt,currentOdd) => {
    try {

        // clear bet slip
        await page.waitForSelector('.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count')

        const betslip = await page.evaluate(() => {
            const wrapper = document.querySelector(`.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count`)
            console.log(wrapper.innerHTML)
            return wrapper.innerHTML;
        });
        if (betslip != "") {
            try {
                await page.waitForSelector('.m-item:nth-child(1) > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete')
                await page.click('.m-item:nth-child(1) > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete')
                await page.waitForSelector('.m-opertaion > .m-table > .m-table-row > .m-align--right > .m-text-min')
                await page.click('.m-opertaion > .m-table > .m-table-row > .m-align--right > .m-text-min')
            } catch (e) {
                console.log("no remove all")
            }
        }

        //check account balance
        let accBal = await accountResource.accountBalance(page)
        if (accBal < betAmt) {
            console.log("insuffiecient funds to make bet")
            logArchitect.addItem({ "Bet Status": `insuffiecient funds to make bet -  ${accBal} Ghs` })
            return;
        }

        //click on item
        await page.waitForSelector(`.m-table__wrapper:nth-child(${marketCountItem}) > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomeValue}) > .m-table-cell-item:nth-child(2)`)
        await page.click(`.m-table__wrapper:nth-child(${marketCountItem}) > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomeValue}) > .m-table-cell-item:nth-child(2)`)

        // change value
        await page.waitForSelector('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input')
        const input = await page.$('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input');
        await input.click({ clickCount: 3 })
        await page.type('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input', `${betAmt}`)

        if(placeBet.validateBetOdd(page,currentOdd)){
                    //click on place bet
        const acceptBet = await page.evaluate(() => {
            const wrapper = document.querySelector(`.m-betslips > .m-stake > div > .m-btn-wrapper > .af-button > span`)
            // console.log(wrapper.innerHTML)
            return wrapper.innerHTML.trim;
        }); 

        console.log(acceptBet)

        if (acceptBet == "Accept Changes") {
            console.log("changes")
        }

        await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
        await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')
        
        if(placeBet.validateBetOdd(page,currentOdd)){
        // click on final bet
        await page.waitForSelector('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')
        await page.click('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')
        }


        console.log("bet Placed") 

        logArchitect.addItem({ "BetStatus": `Bet Placed` })

        await page.waitForTimeout(5000).then(async () => await page.reload())
        } else{

            console.log("No Bet Placed") 

            logArchitect.addItem({ "Bet Status": `No Bet Placed - Non Matching Odds` })
        }



    } catch (error) {
        console.log(error);
        console.log("Unable to Place Bet Now")
    }
}

placeBet.validateBetOdd = async (page,currentOdd) => {

    const getOdd = await page.evaluate(() => {
        const wrapper = document.querySelector(`.m-lay-mid > .m-lay-mid > .m-item-main > .m-item-odds > .m-text-main`)
        console.log(wrapper.innerHTML)
        return wrapper.innerHTML;
    });
   if(getOdd != currentOdd)
    return false
   else
     return true
}
 

module.exports = placeBet;

