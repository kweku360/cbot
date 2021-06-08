var betUtils = require("../../managers/bet/utils");
var placeBet = require("../../managers/bet/placebet");
var logArchitect = require("../../managers/log/architect");
liveBet = {};

liveBet.clickLiveBet = async (page) => {
    //click on live betting link
    await page.waitForSelector('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
    await page.click('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
    try{
        // await page.waitForSelector('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
        // await page.click('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
    }catch(e){
        console.log("Unable to click live bet");
        //await page.reload();
    }

};

liveBet.clickMultipleBet = async (page) => {
    const navigationPromise = page.waitForNavigation();
    await navigationPromise
    //click on multiple views link
    await page.waitForSelector('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
    await page.click('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
    try{
        // const navigationPromise = page.waitForNavigation();
        // await navigationPromise
        // //click on multiple views link
        // await page.waitForSelector('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
        // await page.click('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
    }catch(e){
        console.log("Unable to Click Multiple bet");
    }

};

liveBet.gamerunner = async (page) => {
    // try {
        const navigationPromise = page.waitForNavigation();
        await navigationPromise;
    // } catch (error) {
    //     console.log("Err recorded");
    // }

    // try {
        await page.waitForSelector('.m-overview > .match > .m-table')
        const data = await page.evaluate(() => {
            const wrapper = Array.from(document.querySelectorAll('.m-overview > .match > .m-table'))
            return wrapper.length;
        });
        //get random pick
        const currentPick = getRandomNum(data - 1, 2);
        const leagueGameCount = await page.evaluate((randomPick) => {
            const wrapper = Array.from(document.querySelectorAll(`.m-overview > .match > .m-table:nth-child(${randomPick}) > .m-table-row`))
            return wrapper.length;
        }, currentPick);

        const leagueGamePick = getRandomNum(leagueGameCount - 1, 2);
       //check if time elapsed fits our bill
       await page.waitForSelector('.m-table:nth-child(1) > .m-table-row > .m-table-cell > .left-team-table > .time > .clock-time')
       await page.click('.m-table:nth-child(1) > .m-table-row > .m-table-cell > .left-team-table > .time > .clock-time')
       
       const gameTime = await page.evaluate(() => {
        const wrapper = document.querySelector(`.m-betslips > .m-stake > div > .m-btn-wrapper > .af-button > span`)
        // console.log(wrapper.innerHTML)
        return wrapper.innerHTML.trim;
    }); 

        //now click on market size
    await page.waitForSelector(`.m-overview > .match > .m-table:nth-child(${currentPick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)
    await page.click(`.m-overview > .match > .m-table:nth-child(${currentPick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)


    // } catch (error) {
    //     console.log("No game to pick currently")
    // }
    
}

function getRandomNum(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


liveBet.singleGameMarket = async (page) => {
//  try {
    await page.waitForSelector('.m-detail-wrapper > .m-table__wrapper')
    const marketcount = await page.evaluate(() => {
        const wrapper = Array.from(document.querySelectorAll('.m-detail-wrapper > .m-table__wrapper'))
        return wrapper.length;
    });
    console.log("total markets  " + marketcount + "\n")

    logArchitect.addItem({"total markets": marketcount})

    for (var i = 1; i < marketcount; i++) {
        let marketCountItem = i; 
        const outcome = await page.evaluate((marketCountItem) => {
            const wrapper = Array.from(document.querySelectorAll(`.m-detail-wrapper > .m-table__wrapper:nth-child(${marketCountItem}) > .m-table:nth-child(2) > .m-outcome > .m-table-cell`))
            return wrapper.length;
        }, marketCountItem);

        for (var k = 1; k <= outcome; k++) {

            const checkOdds = await page.evaluate((marketCountItem, k) => {
                const wrapper = document.querySelector(`.m-detail-wrapper > .m-table__wrapper:nth-child(${marketCountItem}) > .m-table:nth-child(2) > .m-outcome > .m-table-cell:nth-child(${k}) > .m-table-cell-item:nth-child(2)`)
                if (wrapper != null) {
                    let v = parseFloat(wrapper.innerHTML);
                    if (isNaN(v)) {
                        return 0
                    } else {
                        return wrapper.innerHTML;
                    } 
                } else {
                    return 0;
                }
            }, marketCountItem, k); 

            // console.log("odds value " + checkOdds)
            logArchitect.addItem({"odds value": checkOdds})

            if (checkOdds > 1.03 && checkOdds < 1.07) {

                console.log("Found Correct Range value " + checkOdds)

                logArchitect.addItem({"Success": "true"})
                logArchitect.addItem({"Valid Range Found": checkOdds})

                let betVal = betUtils.calculateOdds(checkOdds, 0.50)
                placeBet.live(page,marketCountItem,k,40,checkOdds); 
                return;
                //placebet
            }
        }
    }

//  } catch (error) {
//     console.log("Single game market error")
//  }

} 



module.exports = liveBet;
