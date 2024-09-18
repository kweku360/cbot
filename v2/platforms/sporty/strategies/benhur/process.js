var State = require("../../../../state");
var PlaceBet = require("./placebet");
var betShore = require("../../../../../ai/betshore");
const PageApi = require("./facade/pageapi");

const Process = {}
Process.pickGameUtd = async (page) => {
    try {

        await PageApi.find("closeSwipeAd", page);
        await PageApi.click("closeSwipeAd", page);

        let gameInfo = {}
        for (let i = 2; i <= 11; i++) {
            console.log(i)
            const homeTeam = await PageApi.getText("homeTeam", page, {
        replacementArr: [i],
      });
            const awayTeam =  await PageApi.getText("awayTeam", page, {
                replacementArr: [i],
              });
              const betableTeams = ["CHE","FOR","FUL","LEI","NEW","SOU",
                "BRE","CRY","EVE","WOL","BHA","AST","WHU","BOU","IPS"]

            // if (homeTeam === "MCI" || awayTeam === "ARS" || awayTeam === "MUN") {
            // if (awayTeam === "MUN") {
            //     gameInfo["home"] = homeTeam
            //     gameInfo["away"] = awayTeam  
            //     await page.waitForSelector(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            //  .m-table-row > .m-table-cell > span:nth-child(2)`)
            //     await page.click(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            //  .m-table-row > .m-table-cell > span:nth-child(2)`)
            //     break
            // }
        }


        await PageApi.delay(3000);
        const data = await page.evaluate(() => {
            const wrapper = Array.from(
                document.querySelectorAll("div.market")
            );
            return wrapper.length;
        });

        //get values
        const homeDraw = await page.$eval(
            `.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`,
            (el) => el.innerHTML
        );
        const homeAway = await page.$eval(
            `.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`,
            (el) => el.innerHTML
        );

        gameInfo["homeDrawOdd"] = homeDraw;
        gameInfo["homeAwayOdd"] = homeAway;


         //select active oods
        //home
        await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)')
        await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)')

        // //draw
        // await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)')
        // await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)')

        //away
        await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(2)')
        await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(2)')

        //draw or away
        await page.waitForSelector('.event-detail > .market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(1)')
        await page.click('.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(1)')

        // click to expand
        await page.waitForSelector('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
        await page.click('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
        await PageApi.delay(3000);

        // const betAr = [3,4,5]

        const bAmt = [.3, .3, .5]

        for (let i = 1; i <= 3; i++) {
            await PageApi.delay(500);
            // click and add amount
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)

            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)
            await PageApi.delay(500);
            // //delete value
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)
            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)

            await PageApi.delay(500);

            let amount = bAmt[i - 1] + "";
            if (amount[amount.length - 1] === "0" && amount.includes(".")) {
                let str = amount.split("")
                str[amount.length - 1] = "1"
                amount = str.join('')
            }

            for (let ch of amount) {
                ch = ch == "." ? "d" : parseInt(ch, 10)
                await PageApi.delay(500);
                if (ch !== 0 && ch <= 6) {
                    await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                    await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                }
                if (ch === 0 || ch > 6 || ch === "d") {
                    //mappin
                    const kMaps = { "7": "1", "8": "2", "9": "3", "0": "4", "d": "5" }

                    await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))

                    await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))
                }
            }
            // click done
            await PageApi.delay(500);
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
            await PageApi.delay(500);
        }
        //check total stake
        const totalStake = await page.$eval(
            '#betslip-container > .scroll-wrapper > #single-stake > .stake-column:nth-child(2) > span:nth-child(2)',
            (el) => el.innerHTML
        );

         //click place bet if all checks out
         await page.waitForSelector('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')
         await page.click('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')
 
         await PageApi.delay(1000);
 
         // //click confirm
         await page.waitForSelector('#confirm-btn')
         await page.click('#confirm-btn')
 
         await PageApi.delay(2000);
 
 
         //run bet
         await PageApi.delay(3000);
         await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
         await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
 
         await PageApi.delay(3000);
 
         //skip to result
         await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
         await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
 
         await PageApi.delay(5000);

        //check for success / or loss
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

        //repeat
        await PageApi.delay(5000);

        Process.pickGameUtd(page);

    } catch (e) {
        console.error(e)
        //reload page
        await page.reload();
        await PageApi.delay(3000);
        //click on next round or (todo) open bets
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        console.log("next round clicked")
        //restart
        await PageApi.delay(3000);
        Process.pickGameUtd(page);  
    }
}
Process.pickGame = async (page) => {
    try {

        let gameInfo = {}
        for (let i = 2; i <= 11; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );
            // if (homeTeam === "MCI" || awayTeam === "ARS" || awayTeam === "MUN") {
            if (awayTeam === "MUN") {
                gameInfo["home"] = homeTeam
                gameInfo["away"] = awayTeam
                await page.waitForSelector(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                await page.click(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                break
            }
        }


        await page.waitForTimeout(3000);
        const data = await page.evaluate(() => {
            const wrapper = Array.from(
                document.querySelectorAll("div.market")
            );
            return wrapper.length;
        });

        //get values
        const homeDraw = await page.$eval(
            `.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`,
            (el) => el.innerHTML
        );
        const homeAway = await page.$eval(
            `.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`,
            (el) => el.innerHTML
        );

        gameInfo["homeDrawOdd"] = homeDraw;
        gameInfo["homeAwayOdd"] = homeAway;

        //lets randomize stuff
        const r = [1, 2, 3]
        const rE = Math.floor(Math.random() * r.length);
        // let v = r[rE] + "" //env
        let v = 3 + "" //env
        //lets play
        await page.waitForSelector(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(${v}) > em:nth-child(2)`)
        await page.click(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(${v}) > em:nth-child(2)`)


        // //check if city is home or away
        // if (gameInfo["away"] === "ARS") {
        //     //click on home or draw

        //     await page.waitForSelector(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`)
        //     await page.click(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`)
        //     gameInfo["betType"] = "Home or Draw"
        // } else {
        //     throw new Error('parameter not met');
        //     //click on away or home
        //     // await page.waitForSelector(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`)
        //     // await page.click(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`)
        //     // gameInfo["betType"] = "Home or Away"

        // }


        await page.waitForTimeout(2000);
        //setup to change amount
        await page.waitForSelector('.stake-input > div > .m-input-keyboard-wrapper')
        await page.click('.stake-input > div > .m-input-keyboard-wrapper')

        await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)
        await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)

        //enter anount
        const randomAmt = [4,4.4,4.6,4.8,5]
        // const randomAmt = [0.7, 0.8, 0.5, 0.6, 0.4]
        const randomElement = Math.floor(Math.random() * randomAmt.length);
        let amount = randomAmt[randomElement] + "" //env
        if (amount[amount.length - 1] === "0" && amount.includes(".")) {
            let str = amount.split("")
            str[amount.length - 1] = "1"
            amount = str.join('')
        }
        for (let ch of amount) {
            ch = ch == "." ? ch : parseInt(ch, 10)
            await page.waitForTimeout(500);
            if (ch !== 0 && ch <= 6) {
                await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
            }
            if (ch === ".") {
                await page.waitForSelector('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                await page.click('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
            }
            if (ch === 0 || ch > 6) {
                await page.waitForSelector(`[data-key*="${ch}"]`);
                const el = await page.$(`[data-key*="${ch}"]`);
                el.click()
            }
        }

        // click place bet
        await page.waitForSelector('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')
        await page.click('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')

        // verify bet amount
        const btAmt = await page.$eval(
            `.quick-bet-container > #confirm-pop-wrapper > #confirm-pop > #confirm-pop__top > .bold`,
            (el) => el.innerHTML
        );
        console.log(btAmt);

        if (!btAmt.includes(amount)) {
            console.log("start reversal action")
        }
        await page.waitForTimeout(500);

        //click confirm
        await page.waitForSelector('#confirm-btn')
        await page.click('#confirm-btn')

        await page.waitForTimeout(3000);

        //run bet
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

        await page.waitForTimeout(3000);

        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

        await page.waitForTimeout(5000);

        //check for success / or loss
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

        //repeat
        await page.waitForTimeout(5000);

        Process.pickGame(page);

    } catch (e) {
        console.log('Error - ' + e.message + ` Reloading`)
        //reload page
        await page.reload();
        await page.waitForTimeout(3000);
        //click on next round or (todo) open bets
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        console.log("next round clicked")
        //restart
        await page.waitForTimeout(3000);
        Process.pickGame(page);
    }
}

Process.pickGameLuton = async (page) => {
    try {

        let gameInfo = {}
        for (let i = 2; i <= 11; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );
            if (homeTeam === "LUT" || awayTeam === "LUT") {
                gameInfo["home"] = homeTeam
                gameInfo["away"] = awayTeam
                await page.waitForSelector(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                await page.click(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                break
            }
        }


        await page.waitForTimeout(3000);
        const data = await page.evaluate(() => {
            const wrapper = Array.from(
                document.querySelectorAll("div.market")
            );
            return wrapper.length;
        });

        //get values
        let lutonOdd = "";
        if (gameInfo["home"] === "LUT") {
            lutonOdd = await page.$eval(
                '.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3) > em',
                (el) => el.innerHTML
            );
        } else {
            lutonOdd = await page.$eval(
                '.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3) > em',
                (el) => el.innerHTML
            );
        }


        // console.log(pa)

        if (parseFloat(lutonOdd.trim()) <= 1.07) {
            throw new Error('parameter not met');
        } else {

            // gameInfo["homeDrawOdd"] = homeDraw;
            // gameInfo["homeAwayOdd"] = homeAway;

            //check if luton is home or away
            if (gameInfo["home"] === "LUT") {
                //click all odd
                // 1.under 2.5 - main odd
                await page.waitForSelector('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3)')
                await page.click('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3)')

                // await page.waitForSelector('.market:nth-child(3) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(3) > em')
                // await page.click('.market:nth-child(3) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(3) > em')

                //over 0.5

                await page.waitForSelector('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(2)')

                //over 1.5
                await page.waitForSelector('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(3) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(3) > .m-table-cell:nth-child(2)')

                //over 2.5
                await page.waitForSelector('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(2)')

                // over 3.5
                await page.waitForSelector('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(5) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(3) > .m-table > .m-table-row:nth-child(5) > .m-table-cell:nth-child(2)')



            } else {

                // await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3)')
                // await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3)')

                //await page.waitForTimeout(10000);
                // await page.waitForSelector('.market:nth-child(4) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(3) > em')
                // await page.click('.market:nth-child(4) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(3) > em')

                await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3) > em')
                await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(3) > em')

                //over 0.5

                await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(2) > .m-table-cell:nth-child(2)')

                //over 1.5
                await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(3) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(3) > .m-table-cell:nth-child(2)')

                //over 2.5
                await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(4) > .m-table-cell:nth-child(2)')

                // over 3.5
                await page.waitForSelector('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(5) > .m-table-cell:nth-child(2)')
                await page.click('.event-detail > .market:nth-child(4) > .m-table > .m-table-row:nth-child(5) > .m-table-cell:nth-child(2)')
            }

            // click to expand
            await page.waitForSelector('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
            await page.click('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
            await page.waitForTimeout(2000);

            // const bAmt = [.81, 1.2, 0.61, 0.25, 0.15]
            const bAmt = [1, .21, .49, .19, .11]

            for (let i = 1; i <= 5; i++) {
                await page.waitForTimeout(500);
                // click and add amount
                await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)

                await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)
                await page.waitForTimeout(500);
                // //delete value
                await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)
                await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)

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
                        await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                        await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                    }
                    if (ch === 0 || ch > 6 || ch === "d") {
                        //mappin
                        const kMaps = { "7": "1", "8": "2", "9": "3", "0": "4", "d": "5" }

                        await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))

                        await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))
                    }
                }
                // click done
                await page.waitForTimeout(500);
                await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
                await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
                await page.waitForTimeout(500);
            }

            //check total stake
            const totalStake = await page.$eval(
                '#betslip-container > .scroll-wrapper > #single-stake > .stake-column:nth-child(2) > span:nth-child(2)',
                (el) => el.innerHTML
            );
            // console.log(totalStake)

            //click place bet if all checks out
            await page.waitForSelector('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')
            await page.click('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')

            await page.waitForTimeout(1000);

            // //click confirm
            await page.waitForSelector('#confirm-btn')
            await page.click('#confirm-btn')

            await page.waitForTimeout(2000);

            // //run bet
            await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
            await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

            await page.waitForTimeout(3000);

            // //skip to result
            await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
            await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

            await page.waitForTimeout(3000);

            //check for success / or loss
            const result = await page.$eval(
                `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
                (el) => el.innerHTML
            );
            let res = result.split(":")[1]
            console.log("Game result - " + res)
            gameInfo["Outcome"] = res;
            gameInfo["Result"] = parseInt(res.split(" ")[1]);
            gameInfo["time"] = Date().toLocaleString();
            State.setState("bets", [...State.bets, gameInfo])

            //begin nex next round 
            await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

            //repeat
            await page.waitForTimeout(5000);

            Process.pickGameLuton(page);
        }
    } catch (e) {
        console.log('Error - ' + e.message + ` Reloading`)
        //reload page
        await page.reload();
        await page.waitForTimeout(3000);
        //click on next round or (todo) open bets
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        console.log("next round clicked")
        //restart
        await page.waitForTimeout(3000);
        Process.pickGameLuton(page);
    }
}

Process.pickGameBetShore = async (page) => {
    try {

        let gameInfo = {}
        let finalGameOdd = { "odd": 0, "gameIndex": 0 }
        let leagueId = setLeague();
        for (let i = 2; i <= leagueId.count; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );

            //pick odds also
            const homeOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(1) > span`,
                (el) => el.innerHTML
            );
            const awayOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(3) > span`,
                (el) => el.innerHTML
            );
            const drawOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(2) > span`,
                (el) => el.innerHTML
            );

            let h = parseFloat(homeOdd.trim());
            let a = parseFloat(awayOdd.trim());
            let d = parseFloat(drawOdd.trim());

            if (a >= 4 && a <= 5) {
                finalGameOdd["homeodd"] = h;
                finalGameOdd["drawodd"] = d;
                finalGameOdd["awayodd"] = a;
                finalGameOdd["leagueId"] = leagueId.id
                finalGameOdd.gameIndex = i;
                break;
            }
        }
        console.log(finalGameOdd)

        if (finalGameOdd.gameIndex === 0) {
            throw new Error("Parameters not met -- lets move on")
        }

        await page.waitForTimeout(2000);

        //click on chossen game
        await page.waitForSelector(`.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${finalGameOdd.gameIndex}) > .m-table-row > .m-table-cell > span:nth-child(2)`)
        await page.click(`.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${finalGameOdd.gameIndex}) > 
     .m-table-row > .m-table-cell > span:nth-child(2)`)

        await page.waitForTimeout(2000);
        //choose random strategy todo

        //select active oods
        //home
        await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)')
        await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)')

        //draw
        await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)')
        await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)')

        //away
        await page.waitForSelector('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(2)')
        await page.click('.event-detail > .market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(2)')

        //home or away
        await page.waitForSelector('.event-detail > .market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(1)')
        await page.click('.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(1)')

        // click to expand
        await page.waitForSelector('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
        await page.click('#insta-win > #quick-game-container > #quick-bet-container > .fast-mul-betslip > .flex')
        await page.waitForTimeout(2000);

        const bAmt = [.51, .16, .20, .19]

        for (let i = 1; i <= 4; i++) {
            await page.waitForTimeout(500);
            // click and add amount
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)

            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input`)
            await page.waitForTimeout(500);
            // //delete value
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)
            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(7)`)

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
                    await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                    await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`))
                }
                if (ch === 0 || ch > 6 || ch === "d") {
                    //mappin
                    const kMaps = { "7": "1", "8": "2", "9": "3", "0": "4", "d": "5" }

                    await page.waitForSelector((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))

                    await page.click((`.betslip-option:nth-child(${i}) > .betslip-option_right:nth-child(2) > .option-content:nth-child(2) > .stake-input-wrapper:nth-child(2) > .stake-input:nth-child(1) .m-input-keyboard-wrapper:nth-child(1) > .m-keyboard:nth-child(2) > .flexpad-wrap:nth-child(1) .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`))
                }
            }
            // click done
            await page.waitForTimeout(500);
            await page.waitForSelector(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
            await page.click(`.betslip-option:nth-child(${i}) > .betslip-option_right > .option-content > .stake-input-wrapper > .stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper`)
            await page.waitForTimeout(500);
        }
        //check total stake
        const totalStake = await page.$eval(
            '#betslip-container > .scroll-wrapper > #single-stake > .stake-column:nth-child(2) > span:nth-child(2)',
            (el) => el.innerHTML
        );

        //click place bet if all checks out
        await page.waitForSelector('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')
        await page.click('#quick-game-container > #betslip-backdrop > #betslip-container > #bet-btn > p:nth-child(2)')

        await page.waitForTimeout(1000);

        // //click confirm
        await page.waitForSelector('#confirm-btn')
        await page.click('#confirm-btn')

        await page.waitForTimeout(2000);


        //run bet
        await page.waitForTimeout(3000);
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

        await page.waitForTimeout(3000);

        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

        await page.waitForTimeout(5000);

        //check for success / or loss
        // logs
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

        //repeat
        await page.waitForTimeout(3000);

        Process.pickGameBetShore(page);

    } catch (e) {
        console.log('Error - ' + e.message)
        const msgNodeDetach = "Node is detached from document"
        if (e.message.trim() === msgNodeDetach) {
            await page.reload();
            await page.waitForTimeout(3000);
            openBets(page);
            Process.pickGameBetShore(page);
            return
        }
        //reload page
        await page.reload();
        await page.waitForTimeout(2000);
        //click on next round or (todo) open bets
        const nVal = await page.$eval('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span',
            (el) => el.innerHTML
        );
        //move to next round
        if (nVal === "Next Round") {
            await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            console.log("Moving to next round")
        }
        if (nVal === "Open Bets") {
            //run bet
            await page.waitForTimeout(2000);
            await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
            await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

            await page.waitForTimeout(3000);

            //skip to result
            await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
            await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

            //begin nex next round 
            await page.waitForTimeout(1000);

            await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            console.log("Open bet - running")
        }

        await page.waitForTimeout(2000);
        Process.pickGameBetShore(page);
    }
}

Process.pickGameBetShoreV2 = async (page) => {
    try {

        let gameInfo = {}
        let finalGameOdd = { "odd": 0, "gameIndex": 0 }
        let leagueId = setLeague();
        for (let i = 2; i <= leagueId.count; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );

            //pick odds also
            const homeOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(1) > span`,
                (el) => el.innerHTML
            );
            const awayOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(3) > span`,
                (el) => el.innerHTML
            );
            const drawOdd = await page.$eval(
                `.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(2) > span`,
                (el) => el.innerHTML
            );

            let h = parseFloat(homeOdd.trim());
            let a = parseFloat(awayOdd.trim());
            let d = parseFloat(drawOdd.trim());

            // if ((h > 1.3 && h < 2) && a > 5) {
            //     console.log(h)
            //send odds to engine
            const request = {
                "betamt": 3, //env
                "losspercent": 50,
                "drawlosspercent": 0,
                "home": h,
                "draw": d,
                "away": a
            }
            const payload = betShore.run(request, "process")
            if (payload[3] > finalGameOdd.odd) {
                finalGameOdd.odd = payload[3];
                finalGameOdd.gameIndex = i;
                finalGameOdd["payload"] = payload;
                finalGameOdd["homeodd"] = h;
                finalGameOdd["drawodd"] = d;
                finalGameOdd["awayodd"] = a;
                finalGameOdd["leagueId"] = leagueId.id
                gameInfo["hometeam"] = homeTeam;
                gameInfo["awayteam"] = awayTeam;
            }
            // }
        }
        console.log(finalGameOdd)
        console.log(gameInfo.hometeam + " VS " + gameInfo.awayteam)

        await page.waitForTimeout(2000);

        //click on chossen game
        await page.waitForSelector(`.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${finalGameOdd.gameIndex}) > .m-table-row > .m-table-cell > span:nth-child(2)`)
        await page.click(`.m-table:nth-child(${leagueId.id}) > .event-list:nth-child(${finalGameOdd.gameIndex}) > 
     .m-table-row > .m-table-cell > span:nth-child(2)`)

        await page.waitForTimeout(2000);

        for (let i = 0; i <= 2; i++) {
            let k = i == 0 ? 1 : 3;
            await page.waitForTimeout(2000);
            await page.waitForSelector(`.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(${i + 1}) > em:nth-child(2)`)
            await page.click(`.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(${i + 1}) > em:nth-child(2)`)

            await page.waitForTimeout(2000);
            //setup to change amount
            await page.waitForSelector('.stake-input > div > .m-input-keyboard-wrapper')
            await page.click('.stake-input > div > .m-input-keyboard-wrapper')

            await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)
            await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)

            //enter anount
            let amount = finalGameOdd.payload[i] + "";
            if (amount[amount.length - 1] === "0" && amount.includes(".")) {
                let str = amount.split("")
                str[amount.length - 1] = "1"
                amount = str.join('')
            }

            for (let ch of amount) {
                ch = ch == "." ? ch : parseInt(ch, 10)
                await page.waitForTimeout(500);
                if (ch !== 0 && ch <= 6) {
                    await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                    await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                }
                if (ch === ".") {
                    await page.waitForSelector('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                    await page.click('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                }
                if (ch === 0 || ch > 6) {
                    await page.waitForSelector(`[data-key*="${ch}"]`);
                    const el = await page.$(`[data-key*="${ch}"]`);
                    el.click()
                }
            }

            // click place bet
            await page.waitForSelector('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')
            await page.click('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')

            // verify bet amount
            const btAmt = await page.$eval(
                `.quick-bet-container > #confirm-pop-wrapper > #confirm-pop > #confirm-pop__top > .bold`,
                (el) => el.innerHTML
            );
            // console.log(btAmt);

            if (!btAmt.includes(amount)) {
                console.log("start reversal action")
            }
            await page.waitForTimeout(500);

            //click confirm
            await page.waitForSelector('#confirm-btn')
            await page.click('#confirm-btn')

            await page.waitForTimeout(5000);
            if (i <= 1) {
                //click on keep betting
                await page.waitForSelector('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
                await page.click('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
            }

        }
        //run bet
        await page.waitForTimeout(3000);
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

        await page.waitForTimeout(3000);

        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

        await page.waitForTimeout(5000);

        //check for success / or loss
        // logs
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

        //repeat
        await page.waitForTimeout(3000);

        Process.pickGameBetShore(page);

    } catch (e) {
        console.log('Error - ' + e.message)
        const msgNodeDetach = "Node is detached from document"
        if (e.message.trim() === msgNodeDetach) {
            await page.reload();
            await page.waitForTimeout(3000);
            openBets(page);
            Process.pickGameBetShore(page);
            return
        }
        //reload page
        await page.reload();
        await page.waitForTimeout(2000);
        //click on next round or (todo) open bets
        const nVal = await page.$eval('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span',
            (el) => el.innerHTML
        );
        //move to next round
        if (nVal === "Next Round") {
            await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            console.log("Moving to next round")
        }
        if (nVal === "Open Bets") {
            //run bet
            await page.waitForTimeout(2000);
            await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
            await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

            await page.waitForTimeout(3000);

            //skip to result
            await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
            await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

            //begin nex next round 
            await page.waitForTimeout(1000);

            await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            console.log("Open bet - running")
        }

        await page.waitForTimeout(2000);
        Process.pickGameBetShore(page);
    }
}


Process.pickGameBetShoreV1 = async (page) => {
    try {

        let gameInfo = {}
        for (let i = 2; i <= 11; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );
            if (homeTeam === "MCI" || awayTeam === "MCI") {
                gameInfo["home"] = homeTeam
                gameInfo["away"] = awayTeam
                await page.waitForSelector(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                await page.click(`.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
             .m-table-row > .m-table-cell > span:nth-child(2)`)
                break
            }
        }
        await page.waitForTimeout(3000);
        const data = await page.evaluate(() => {
            const wrapper = Array.from(
                document.querySelectorAll("div.market")
            );
            return wrapper.length;
        });

        //get values
        const h = await page.$eval(
            `.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`,
            (el) => el.innerHTML
        );
        const a = await page.$eval(
            `.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`,
            (el) => el.innerHTML
        );

        const d = await page.$eval(
            `.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(3) > em:nth-child(2)`,
            (el) => el.innerHTML
        );

        //calculate shore values
        const request = {
            "betamt": 1, //env
            "losspercent": -50,
            "drawlosspercent": 100,
            "home": h,
            "draw": d,
            "away": a
        }
        const payload = betShore.run(request, "process")
        console.log(payload)

        for (let i = 0; i <= 1; i++) {
            let k = i == 0 ? 1 : 3;
            await page.waitForTimeout(2000);
            await page.waitForSelector(`.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(${k}) > em:nth-child(2)`)
            await page.click(`.market:nth-child(1) > .m-table > .m-table-row > .m-table-cell:nth-child(${k}) > em:nth-child(2)`)

            await page.waitForTimeout(2000);
            //setup to change amount
            await page.waitForSelector('.stake-input > div > .m-input-keyboard-wrapper')
            await page.click('.stake-input > div > .m-input-keyboard-wrapper')

            await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)
            await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)

            //enter anount
            let amount = payload[i] + "";
            if (amount[amount.length - 1] === "0" && amount.includes(".")) {
                let str = amount.split("")
                str[amount.length - 1] = "1"
                amount = str.join('')
            }

            for (let ch of amount) {
                ch = ch == "." ? ch : parseInt(ch, 10)
                await page.waitForTimeout(500);
                if (ch !== 0 && ch <= 6) {
                    await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                    await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                }
                if (ch === ".") {
                    await page.waitForSelector('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                    await page.click('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                }
                if (ch === 0 || ch > 6) {
                    await page.waitForSelector(`[data-key*="${ch}"]`);
                    const el = await page.$(`[data-key*="${ch}"]`);
                    el.click()
                }
            }

            // click place bet
            await page.waitForSelector('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')
            await page.click('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')

            // verify bet amount
            const btAmt = await page.$eval(
                `.quick-bet-container > #confirm-pop-wrapper > #confirm-pop > #confirm-pop__top > .bold`,
                (el) => el.innerHTML
            );
            console.log(btAmt);

            if (!btAmt.includes(amount)) {
                console.log("start reversal action")
            }
            await page.waitForTimeout(500);

            //click confirm
            await page.waitForSelector('#confirm-btn')
            await page.click('#confirm-btn')

            await page.waitForTimeout(5000);
            if (i === 0) {
                //click on keep betting
                await page.waitForSelector('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
                await page.click('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
            }

        }
        // //check if city is home or away
        // if (gameInfo["home"] === "MCI") {
        //     //click on home or draw

        //     await page.waitForSelector(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`)
        //     await page.click(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(1) > em:nth-child(2)`)
        //     gameInfo["betType"] = "Home or Draw"
        // } else {
        //     //click on away or home
        //     await page.waitForSelector(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`)
        //     await page.click(`.market:nth-child(5) > .m-table > .m-table-row > .m-table-cell:nth-child(2) > em:nth-child(2)`)
        //     gameInfo["betType"] = "Home or Away"

        // }
        //run bet
        await page.waitForTimeout(3000);
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

        await page.waitForTimeout(3000);

        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

        await page.waitForTimeout(5000);

        //check for success / or loss
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')

        //repeat
        await page.waitForTimeout(5000);

        Process.pickGameBetShore(page);

    } catch (e) {
        console.log('Error - ' + e.message)
        const msg = "Node is detached from document"
        if (e.message.trim() === msg) {
            await page.reload();
            await page.waitForTimeout(2000);
            Process.pickGameBetShore(page);
            return
        }
        //reload page
        await page.waitForTimeout(2000);
        await page.reload();
        await page.waitForTimeout(2000);
        //click on next round or (todo) open bets
        const nVal = await page.$eval('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span',
            (el) => el.innerHTML
        );
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        console.log(nVal)
        if (nVal === "Open Bets") {
            //run bet
            await page.waitForTimeout(3000);
            await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
            await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

            await page.waitForTimeout(3000);

            //skip to result
            await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
            await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

            //begin nex next round 
            await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
            console.log("Open bet - running")
        }
        console.log("Moving to next round")
        //restart
        await page.waitForTimeout(3000);
        Process.pickGameBetShoreV1(page);
    }
}


Process.pickGameReverse = async (page) => {
    try {

        let gameInfo = {};
        let activeTeam = "";
        let teamIndex = ""
        for (let i = 2; i <= 10; i++) {
            await page.waitForTimeout(1000);
            const homeTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .m-table-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );
            if (homeTeam === "MCI") {
                activeTeam = homeTeam;
                teamIndex = i;
                break
            }
        }

        if (activeTeam !== "") {
            let i = teamIndex;
            const homeOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(1) > span`,
                (el) => el.innerHTML
            );
            const awayOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(3) > span`,
                (el) => el.innerHTML
            );
            const drawOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(2) > span`,
                (el) => el.innerHTML
            );

            let h = parseFloat(homeOdd.trim());
            let a = parseFloat(awayOdd.trim());
            let d = parseFloat(drawOdd.trim());

            if ((h > 1.4 || h < 1.7) && a > 4) {
                // processBet(h, a, teamIndex, page);
                // //run bet
                // runBet(page)
                // Process.pickGameReverse(page);
            }
            else {
                console.log("Criteria not met")
                await page.waitForTimeout(1000);
                //click on next round or (todo) open bets
                await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
                await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
                //restart
                await page.waitForTimeout(1000);
                Process.pickGameReverse(page);
            }
        }
        else {
            console.log("No home team found")
            await page.waitForTimeout(1000);
            //click on next round or (todo) open bets
            await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
            //restart
            await page.waitForTimeout(2000);
            Process.pickGameReverse(page);
        }

    } catch (e) {
        console.log('Error - ' + e.message + ` Reloading`)
        //reload page
        // await page.reload();
        await page.waitForTimeout(2000);
        //click on next round or (todo) open bets
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        console.log("next round clicked")
        //restart
        await page.waitForTimeout(2000);
        Process.pickGameReverse(page);
    }
}

Process.reverseBetShore = async (page) => {
    try {
        let activeTeam = "";
        let gameIndex = "";
        const data = await page.evaluate(() => {
            const wrapper = Array.from(
                document.querySelectorAll(".m-table:nth-child(1) > div")
            );
            return wrapper.length;
        });
        console.log("data : " + data);
        for (let i = 2; i <= data; i++) {
            const homeTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(2)`,
                (el) => el.innerHTML
            );
            const awayTeam = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${i}) > 
            .m-table-row > .teams-cell > span:nth-child(4)`,
                (el) => el.innerHTML
            );
            if (homeTeam === "MCI") {
                activeTeam = homeTeam;
                gameIndex = i;
                break
            }
        }

        if (activeTeam !== "") {
            const homeOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${gameIndex}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(1) > span`,
                (el) => el.innerHTML
            );
            const awayOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${gameIndex}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(3) > span`,
                (el) => el.innerHTML
            );
            const drawOdd = await page.$eval(
                `.m-table:nth-child(1) > .event-list:nth-child(${gameIndex}) > 
         .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(2) > span`,
                (el) => el.innerHTML
            );

            let h = parseFloat(homeOdd.trim());
            let a = parseFloat(awayOdd.trim());
            let d = parseFloat(drawOdd.trim());

            //calculate shore values
            const request = {
                "betamt": 1, //env
                "losspercent": -50,
                "drawlosspercent": 100,
                "home": h,
                "draw": d,
                "away": a
            }
            const payload = betShore.run(request, "process")
            console.log(payload)
            //run first event
            await page.waitForTimeout(3000);
            processBet(1, gameIndex, payload[0], page)
            // click keep bettng - todo check open bet
            // await page.waitForTimeout(3000);
            // await page.waitForSelector('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
            // await page.click('#insta-win > #open-bets-container > .btn-nav-bottom > .nav-bottom-left > span')
            //run second event
            // await page.waitForTimeout(3000);
            //  processBet(3, gameIndex, payload[1], page)
            // run bet finally
            // await page.waitForTimeout(3000);
            runBet(page)
            //repeat
            await page.waitForTimeout(3000);
            Process.reverseBetShore(page);
        } else {
            const msg = "No active team found"
            handleError(page, msg)
        }

    } catch (e) {
        const msg = "E-329 - " + e.message
        handleError(page, msg)
    }
}

const processBet = async (oddIndex, gameIndex, betAmt, page) => {
    try {
        //click on odd based on index [1,2,3]
        await page.waitForSelector(`.m-table:nth-child(1) > .event-list:nth-child(${gameIndex}) > 
     .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(${oddIndex})`)
        await page.click(`.m-table:nth-child(1) > .event-list:nth-child(${gameIndex}) > 
     .m-table-row > .m-table-cell > .market > .iw-outcome:nth-child(${oddIndex})`)

        //continue
        //setup to change amount
        await page.waitForTimeout(2000);
        await page.waitForSelector('.stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input')
        await page.click('.stake-input > div > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input')
        await page.waitForTimeout(500);
        await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)
        await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-delete`)

        //enter anount
        let amount = betAmt + "";
        if (amount[amount.length - 1] === "0" && amount.includes(".")) {
            let str = amount.split("")
            str[amount.length - 1] = "1"
            amount = str.join('')
        }

        for (let ch of amount) {
            ch = ch == "." ? ch : parseInt(ch, 10)
            await page.waitForTimeout(500);
            if (ch !== 0 && ch <= 6) {
                await page.waitForSelector(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
                await page.click(`.m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`)
            }
            if (ch === ".") {
                await page.waitForSelector('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
                await page.click('.m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(5)')
            }
            if (ch === 0 || ch > 6) {
                await page.waitForSelector(`[data-key*="${ch}"]`);
                const el = await page.$(`[data-key*="${ch}"]`);
                el.click()
            }
        }

        // click place bet
        await page.waitForTimeout(3000);
        await page.waitForSelector('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')
        await page.click('.nav-bottom-container > .btn > .place-bet > .place-bet-text > span')

        // verify bet amount
        const btAmt = await page.$eval(
            `.quick-bet-container > #confirm-pop-wrapper > #confirm-pop > #confirm-pop__top > .bold`,
            (el) => el.innerHTML
        );

        if (!btAmt.includes(amount)) {
            console.log("start reversal action")
        }

        //click confirm
        await page.waitForTimeout(3000);
        await page.waitForSelector('#confirm-btn')
        await page.click('#confirm-btn')
    }
    catch (e) {
        const msg = "E-403 - " + e.message
        handleError(page, msg)
    }
}

const runBet = async (page) => {
    try {
        let gameInfo = {};
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')


        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')

        //check for success / or loss
        const result = await page.$eval(
            `.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win`,
            (el) => el.innerHTML
        );
        let res = result.split(":")[1]
        console.log("Game result - " + res)
        gameInfo["Outcome"] = res;
        gameInfo["Result"] = parseInt(res.split(" ")[1]);
        gameInfo["time"] = Date().toLocaleString();
        State.setState("bets", [...State.bets, gameInfo])

        //begin next next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
    } catch (e) {
        const msg = "E-441 - " + e.message
        handleError(page, msg)
    }

}
const openBets = async (page, msg = "") => {
    const nVal = await page.$eval('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span',
        (el) => el.innerHTML);

    if (nVal === "Open Bets") {
        //run bet
        await page.waitForTimeout(2000);
        await page.waitForSelector('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')
        await page.click('#open-bets-container > .btn-nav-bottom > .nav-bottom-right > span > span')

        await page.waitForTimeout(3000);
        //skip to result
        await page.waitForSelector('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.click('#insta-win > #iv-live-score > #iv-live-score-running > .bottom > span')
        await page.waitForTimeout(2000);
        //begin nex next round 
        await page.waitForSelector('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        await page.click('.btn-nav-bottom > .nav-bottom-right > span > .btn-right > .total-win')
        console.log("Open bet - running")
    }
}
const handleError = async (page, msg = "") => {

    console.log(msg);
    //next round
    // await page.reload()
    let nVal = await page.$eval(
        `#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span`,
        (el) => el ? el.innerHTML : ""
    );
    if (nVal === "Next Round") {
        console.log("next tound clicked")
        // click on next round
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
    }
    if (nVal == "Open Bets") {
        //click on open bet
        await page.waitForSelector('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')
        await page.click('#quick-game-matche-container > .btn-nav-bottom > .nav-bottom-left > .action-button-sub-container > span')

        runBet(page)
    }

    //repeat
    Process.reverseBetShore(page);
}
const setLeague = () => {
    let currentState = State.activeLeague;
    State.activeLeague = currentState === leagueInfo.length - 1 ? 0 : currentState + 1;
    // console.log(State.activeLeague)
    return leagueInfo[State.activeLeague];

}
const leagueInfo = [
    { "id": 1, "count": 11 },
    { "id": 2, "count": 11 },
    { "id": 3, "count": 11 },
    { "id": 4, "count": 11 },
    { "id": 5, "count": 10 },
]

module.exports = Process