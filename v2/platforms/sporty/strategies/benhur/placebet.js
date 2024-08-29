/*
 * PlaceBet
 * Places bet on 1 x 2 markets and odds (with validations)
 * @kwekukankam - chancebot 2021
 */
var accountResource = require("../../../../../managers/account/accountmanager");
// var logArchitect = require("../../../../managers/log/architect");
PlaceBet = {}

PlaceBet.live = async (page, betAmt, gameInfo, outcome, outcomechild) => {
    try {

        //sget gameinfo here
        // check account balance (if less than bet amt we abort process)
        let accBal = await accountResource.accountBalance(page)
        console.log("current balance :" + accBal)
        if (accBal < betAmt) {
            //log
            console.log("insuffiecient funds to make bet")
            logArchitect.addItem({ "Bet Status": `insuffiecient funds to make bet -  ${accBal} Ghs` })
            return;
        }
        //Timerchecker
        if (parseInt(gameInfo.currentTime) <= 60) {
            console.log("current time restrictions " + gameInfo.currentTime);
            return;
        }

        //click on item 
        await page.waitForSelector(`.m-table__wrapper:nth-child(${outcome})
         > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomechild}) > .m-table-cell-item:nth-child(1)`)
        await page.click(`.m-table__wrapper:nth-child(${outcome}) 
        > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomechild}) > .m-table-cell-item:nth-child(1)`)


        // change value
        await page.waitForSelector('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input')
        const input = await page.$('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input');
        await input.click({ clickCount: 3 })
        await page.type('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input', `${betAmt}`)

        await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
        await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')

        await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
        await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')

        // click on final bet
        await page.waitForSelector('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')
        await page.click('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')

        //store bet info here
        PlaceBet.betInfo(page, betAmt, gameInfo)

        await page.waitForTimeout(5000).then(async () => {
            await page.reload()
        }
        )
        await page.waitForTimeout(5000).then(async () => {
            PlaceBet.clearBetSlip(page);
        }
        )

    } catch (e) {
        console.log("Placebet.js : Placebet.Live Error")
        console.log(e.toString());

        await page.waitForTimeout(5000).then(async () => {
            await page.reload()
        }
        )
        await page.waitForTimeout(5000).then(async () => {
            PlaceBet.clearBetSlip(page);
        }
        )

    }
}

PlaceBet.validateBetOdd = async (page, currentOdd) => {

    const getOdd = await page.evaluate(() => {
        const wrapper = document.querySelector(`.m-lay-mid > .m-lay-mid > .m-item-main > .m-item-odds > .m-text-main`)
        // console.log(wrapper.innerHTML)
        return wrapper.innerHTML;
    });
    if (getOdd != currentOdd)
        return false
    else
        return true
}

//Clear betslip befor placing a new one.
PlaceBet.clearBetSlip = async (page) => {
    await page.waitForSelector('.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count')
    const betslip = await page.evaluate(() => {
        const wrapper = document.querySelector(`.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count`)
        return wrapper.innerHTML;
    });
    if (betslip != "") {
        try {
            await page.waitForSelector('.m-item > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete')
            await page.click('.m-item > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete');
            console.log("betslip cleared")
        } catch (e) {
            console.log("PlaceBet.js : ClearBetSlip Error")
            console.log(e.toString())
        }
    }
}

PlaceBet.gameInfo = async (page) => {
    const timer = await page.$eval(`.m-live-wrapper > .virtual-match-tracker > .versus-title > div > .time`, (el) => el.innerHTML)
    console.log(timer)
}

PlaceBet.betInfo = async (page, stakeAmt, gameInfo) => {
    try {
        let betInfoObj = {};
        const market = await page.$eval(
            `.m-item > .m-lay-mid > .m-lay-mid > .m-item-main > .m-item-market`,
            (el) => el.innerHTML
        );
        const oddPick = await page.$eval(
            `.m-lay-mid > .m-lay-mid > .m-item-main > .m-item-odds > .m-text-main`,
            (el) => el.innerHTML
        );
        const winAmt = await page.$eval(
            `.m-stake > div > .m-money-wrapper > div > .m-value`,
            (el) => el.innerHTML
        );
        const name = await page.$eval(
            `.m-item > .m-lay-mid > .m-lay-mid > .m-item-play > span`,
            (el) => el.innerHTML
        );

        betInfoObj = {
            id: market.replace(/\s+/g, ''),//shd be the game id if we get it
            name: name.trim(),
            market: market.trim(),
            oddPick: oddPick.trim(),
            stakeAmt,
            winAmt: winAmt.trim(),
            result: "pending",
            betStatus: "running",
            gameInfo,
            dateCreated: Date.now()
        }
        console.log("current bet")
        console.log(betInfoObj);
    } catch (e) {
        console.log("PlaceBet.js : betInfo Error")
        console.log(e.toString())
    }
}


module.exports = PlaceBet;
