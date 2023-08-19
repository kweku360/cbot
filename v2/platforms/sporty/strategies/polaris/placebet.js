/*
 * PlaceBet
 * Places bet on 1 x 2 markets and odds (with validations)
 * @kwekukankam - chancebot 2021
 */
// var accountResource = require("../../account/accountmanager");
// var logArchitect = require("../../../../managers/log/architect");
PlaceBet = {}

PlaceBet.live = async (page, betAmt, currentOdd, outcome, outcomechild) => {
    try {
        // clear bet slip
        // PlaceBet.clearBetSlip(page);

        //check account balance (if less than bet amt we abort process)
        // let accBal = await accountResource.accountBalance(page)
        // if (accBal < betAmt) {
        //     //log
        //     console.log("insuffiecient funds to make bet")
        //     logArchitect.addItem({ "Bet Status": `insuffiecient funds to make bet -  ${accBal} Ghs` })
        //     return;
        // }
        //click on item (change this)
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

        await page.waitForTimeout(5000).then(async () => {
            await page.reload()
        }
        )
        await page.waitForTimeout(5000).then(async () => {
            PlaceBet.clearBetSlip(page);
        }
        )

        // if(PlaceBet.validateBetOdd(page,currentOdd)){
        //             //click on place bet
        // await page.waitForTimeout(5000)
        // const acceptBet = await page.evaluate(() => {
        //     const wrapper = document.querySelector(`div > .m-btn-wrapper > .af-button > span > span`)
        //     console.log(wrapper.innerHTML)
        //     return wrapper.innerHTML.trim;
        // }); 

        // console.log("welcome")
        // console.log(acceptBet)

        // if (acceptBet == "Accept Changes") {
        //     console.log("changes")
        // }

        // await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
        // await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')

        // if(PlaceBet.validateBetOdd(page,currentOdd)){
        // // click on final bet
        // await page.waitForSelector('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')
        // await page.click('.m-comfirm-wrapper > div > .m-btn-wrapper > .af-button--primary > span')
        // }


        // console.log("bet Placed") 

        // logArchitect.addItem({ "BetStatus": `Bet Placed` })

        // await page.waitForTimeout(5000).then(async () => await page.reload())
        // } else{

        //     console.log("No Bet Placed") 

        //     logArchitect.addItem({ "Bet Status": `No Bet Placed - Non Matching Odds` })
        // }

    } catch (error) {
        console.log(error);
        console.log("Unable to Place Bet Now")
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
            console.log(e.toString())
        }
    }
}


module.exports = PlaceBet;


// PlaceBet.live = async (page, betAmt, currentOdd, outcome, outcomechild) => {
//     try {
//         //clear bet slip
//         PlaceBet.clearBetSlip(page);

//         //click on odds
//         console.log(betAmt)
//         console.log(currentOdd)
//         console.log(outcome)
//         console.log(outcomechild)

//         await page.waitForSelector(`.m-table__wrapper:nth-child(${outcome})
//          > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomechild}) > .m-table-cell-item:nth-child(1)`)
//         await page.click(`.m-table__wrapper:nth-child(${outcome}) 
//         > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomechild}) > .m-table-cell-item:nth-child(1)`)

//         const iname = await page.$eval(
//             `.m-table__wrapper:nth-child(${outcome}) 
//         > .m-table > .m-table-row > .m-table-cell:nth-child(${outcomechild}) > .m-table-cell-item:nth-child(1)`,
//             (el) => el.innerHTML
//         );
//         //     // change value
//         await page.waitForSelector('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input')
//         const input = await page.$('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input');
//         await input.click({ clickCount: 3 })
//         await page.type('.m-line-wrapper > .m-value > #j_stake_0 > .m-input-com > .m-input', `${betAmt}`)

//         if (PlaceBet.validateBetOdd(page, currentOdd)) {
//             //click on place bet
//             await page.waitForTimeout(5000)
//             const
//             const acceptBet = await page.evaluate(() => {
//                 const wrapper = document.querySelector(`.m-betslips > .m-stake > div > .m-btn-wrapper > .af-button > span > span`)
//                 console.log(wrapper.innerHTML)
//                 return wrapper.innerHTML.trim;
//             });

//             // if (acceptBet == "Accept Changes") {
//             //     await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
//             //     await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')
//             // }
//             // await page.waitForSelector('.m-stake > div > .m-btn-wrapper > .af-button > span')
//             // await page.click('.m-stake > div > .m-btn-wrapper > .af-button > span')


//             // if (PlaceBet.validateBetOdd(page, currentOdd)) {
//             //     console.log("placing final bet")
//             //     // click on final bet
//             //     await page.waitForSelector('div > .m-btn-wrapper > .af-button--primary > span')
//             //     await page.click('div > .m-btn-wrapper > .af-button--primary > span')
//             // }


//             // logArchitect.addConsoleItem({"msg":"Bet Placed"})

//             // return await page.waitForTimeout(10000).then(async () => {
//             //     await page.waitForSelector('.es-dialog-body > .es-dialog-main > .m-dialog-wrapper > .m-pop-header > .m-icon-close')
//             //     return await page.click('.es-dialog-body > .es-dialog-main > .m-dialog-wrapper > .m-pop-header > .m-icon-close').then(() => { return 1 })

//             // })
//         } else {
//             // logArchitect.addConsoleItem({"msg":"unable to place bet"})
//             return 0;
//         }

//     } catch (error) {
//         console.log("PlaceBet.live "+error.toString())
//         return 0
//     }
// }

// PlaceBet.validateBetOdd = async (page, currentOdd) => {

//     const getOdd = await page.evaluate(() => {
//         const wrapper = document.querySelector(`.m-lay-mid > .m-lay-mid > .m-item-main > .m-item-odds > .m-text-main`)
//         console.log(wrapper.innerHTML)
//         return wrapper.innerHTML;
//     });
//     if (getOdd != currentOdd)
//         return false
//     else
//         return true
// }

// //Clear betslip befor placing a new one.
// PlaceBet.clearBetSlip = async (page) => {
//     await page.waitForSelector('.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count')
//     const betslip = await page.evaluate(() => {
//         const wrapper = document.querySelector(`.betslip-tabs > .m-tabs-nav > .m-tabs-tab-active > div > .m-bet-count`)
//         return wrapper.innerHTML;
//     });
//     console.log(betslip);
//     if (betslip != "") {
//         try {
//             await page.waitForSelector('.m-item > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete')
//             await page.click('.m-item > .m-lay-mid > .m-lay-mid > .m-item-play > .m-icon-delete');
//             console.log("betslip cleared")
//         } catch (e) {
//             console.log(e.toString())
//         }
//     }
// }


// module.exports = PlaceBet;

