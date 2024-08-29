/*
 * Process - Quovadis
 * betting includes picking a strategy and placing a successfull bet. 
 * Loggings and additional tasks
 * @kwekukankam - cbot
 */
const navigate = require("./pagenavigation")
const Process = {};

Process.start = async (page) => {
    try {
        //navigate to 3 hour interval
        navigate.toThreeHourInterval(page);
        await page.waitForTimeout(3000);

        //click on first game  - todo this will be changed testing
        await page.waitForSelector('div:nth-child(3) > .m-event-sport > .m-table-row > .m-table-cell > .team:nth-child(1)')
        await page.click('div:nth-child(3) > .m-event-sport > .m-table-row > .m-table-cell > .team:nth-child(1)')

        //click on ht/ft on favorites - todo check if this exists else move to next game
        await page.waitForTimeout(2000);
        await page.waitForSelector('.m-sport-market > div:nth-child(1) > .m-market > .m-market-title > .text')
        await page.click('.m-sport-market > div:nth-child(1) > .m-market > .m-market-title > .text')

        //click on first 3
        for (let i = 1; i <= 3; i++) {
            await page.waitForTimeout(500);
            await page.waitForSelector(`div:nth-child(1) > .m-market > .m-table > .m-table-row:nth-child(1) > .m-table-cell:nth-child(${i}) > em:nth-child(1)`)
            await page.click(`div:nth-child(1) > .m-market > .m-table > .m-table-row:nth-child(1) > .m-table-cell:nth-child(${i}) > em:nth-child(1)`)
        }
        //click on bottom 3
        for (let i = 1; i <= 2; i++) {
            await page.waitForTimeout(500);
            await page.waitForSelector(`div > .m-market > .m-table > .m-table-row:nth-child(3) > .m-outcome-three:nth-child(${i})`)
            await page.click(`div > .m-market > .m-table > .m-table-row:nth-child(3) > .m-outcome-three:nth-child(${i})`)
        }
        //click to expand betslip
        await page.waitForSelector('#fast-mul-betslip')
        await page.click('#fast-mul-betslip')

        const bAmt = [.2, .2, .2, .2, .2, .2,.2]

        for (let i = 1; i <= 5; i++) {
            await page.waitForTimeout(500);
            // click and add amount
            await page.waitForSelector(`.m-outcomes-list > .m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)
            await page.click(`.m-outcomes-list > .m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)
            await page.waitForTimeout(500);
            // //delete value
            await page.waitForSelector(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(7)`)
            await page.click(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(7)`)

            await page.waitForTimeout(500);

            let amount = bAmt[i - 1] + "";
            if (amount[amount.length - 1] === "0" && amount.includes(".")) {
                let str = amount.split("")
                str[amount.length - 1] = "1"
                amount = str.join('')
            }

            for (let ch of amount) {
                ch = ch == "." ? "d" : parseInt(ch, 10)
                await page.waitForTimeout(500);
                if (ch !== 0 && ch <= 6) {
                    await page.waitForSelector(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`);

                    await page.click(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`);
                }
                if (ch === 0 || ch > 6 || ch === "d") {
                    //mappin
                    const kMaps = { "7": "1", "8": "2", "9": "3", "0": "4", "d": "5" }

                    await page.waitForSelector(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`)
                    await page.click(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`)
                }
            }
            // click done
            await page.waitForTimeout(500);
            await page.waitForSelector(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .right > span`)
            await page.click(`.m-bet-container:nth-child(${i}) > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .right > span`)
            await page.waitForTimeout(500);
        }


        // //place bet
        await page.waitForTimeout(500);
        await page.waitForSelector('.m-betslips-stake-wrapper > .m-betslips-stake > .m-submit > .place-bet > span')
        await page.click('.m-betslips-stake-wrapper > .m-betslips-stake > .m-submit > .place-bet > span')


        // // confirm
        // await page.waitForTimeout(500);
        // await page.waitForSelector('.confirm-wrap > .button-wrap > .flexibet-confirm > span > span')
        // await page.click('.confirm-wrap > .button-wrap > .flexibet-confirm > span > span')

        // //click ok to complete bet
        // await page.waitForTimeout(500);
        // await page.waitForSelector('.success-wrap > .btn-box > .btn-ok > span > span')
        // await page.click('.success-wrap > .btn-box > .btn-ok > span > span')

        //log as active bet

    } catch (error) {
        console.log(error);
    }
}



module.exports = Process