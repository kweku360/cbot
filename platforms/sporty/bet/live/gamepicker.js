/*
 * GamePicker
 * Picks a single game (randomly).
 * @kwekukankam - chancebot 2021
 */
GamePicker = {}

/*
 * Gets the full list of games and picks one randomly.
 * Does some validations on picked game and logs 
 * various data on picked game.
 */
GamePicker.pickGame = async (page) => {

    const navigationPromise = page.waitForNavigation();
    await navigationPromise;

    //get total live leagues available
    await page.waitForSelector('.m-overview > .match > .m-table')
    const data = await page.evaluate(() => {
        const wrapper = Array.from(document.querySelectorAll('.m-overview > .match > .m-table'))
        return wrapper.length;
    });

    //loop through each live league
    for (let i = 0; i < data; i++) {
        //get count of games available for a picked league
        const gameCount = await page.evaluate((val) => {
            const wrapper = Array.from(document.querySelectorAll(`.m-overview > .match > .m-table:nth-child(${val}) > .m-table-row`))
            return wrapper.length;
        }, i);

        for (let j = 1; j <= gameCount; j++) {
            const currentTime = await timerCheck(i, page);
            await pickMarket(i,j,page);
            //we check if current time is greater than a time value
            if (currentTime > 60) {
               // console.log(`Game time reached  - ${currentTime} minutes`)
                // continue
                // await page.waitForSelector(`.m-overview > .match > .m-table:nth-child(${currentLeaguePick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)
                // await page.click(`.m-overview > .match > .m-table:nth-child(${currentLeaguePick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)

            } else {
              //  console.log(`Game time not reached  - ${currentTime} minutes`)
            }
        }


    }

}


/*
 * randomly picks a value from a range
 */
function getRandomNum(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
 * Gets Game info from picked game and adds to log
 */

async function pickedGameInfo(page) {
    const homeTeam = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .teams > .home-team`, el => el.innerHTML);

    console.log("hometeam");
    console.log(homeTeam);

    const awayTeam = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .teams > .away-team`, el => el.innerHTML);

    console.log("awayteam");
    console.log(awayTeam);

    const homeScore = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .score > .score-item:nth-child(1)`, el => el.innerHTML);

    console.log("home score");
    console.log(homeScore.trim());

    const awayScore = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .score > .score-item:nth-child(2)`, el => el.innerHTML);

    console.log("away score");
    console.log(awayScore.trim());

    const leagueName = await page.$eval(`.m-overview > .match > .m-table:nth-child(${currentLeaguePick}) > .m-table-row > .league`, el => el.innerHTML);

    console.log("league name");
    console.log(leagueName);

}

async function timerCheck(currentLeaguePick, page) {
    const matchTime = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .time > .clock-time`, el => el.innerHTML);

    let tVal = matchTime.trim().split(":")
    return parseInt(tVal[0].trim());
}

async function pickMarket(currentleague,currentgame, page) {
    let oddArr = [];
    const homeOdd  =  await singleOdd(page,currentleague,currentgame,1)
    const drawOdd  =  await singleOdd(page,currentleague,currentgame,2)
    const awayOdd  =  await singleOdd(page,currentleague,currentgame,3)
    oddArr = [homeOdd,drawOdd,awayOdd]
    console.log(oddArr);
}

async function singleOdd(page,currentleague,currentgame,outcomechild){
    // console.log(`${currentleague} ${currentgame} ${outcomechild}`);
    return await page.evaluate((j, k,l) => {
        const wrapper = document.querySelector(`.m-table:nth-child(${j}) > .m-table-row:nth-child(${k})> .m-table-cell > .m-market:nth-child(1) > .m-outcome:nth-child(${l}) > .m-outcome-odds`)
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
    }, currentleague, currentgame, outcomechild); 
}

module.exports = GamePicker


    // //get random number from range of live leagues
    // const currentLeaguePick = getRandomNum(data - 1, 2);

    // //get count of games available for a picked league
    // // const gameCount = await page.evaluate((val) => {
    // //     const wrapper = Array.from(document.querySelectorAll(`.m-overview > .match > .m-table:nth-child(${val}) > .m-table-row`))
    // //     return wrapper.length;
    // // }, currentLeaguePick);

    // //get random number from range of games available
    // const leagueGamePick = getRandomNum(gameCount - 1, 2);

    // //we do some logging
    // console.log(leagueGamePick)
    // console.log(currentLeaguePick)

    // const currentTime = await timerCheck(currentLeaguePick, page);

    // //we check if current time is greater than a time value
    // if (currentTime > 60) {
    //     // continue
    //     await page.waitForSelector(`.m-overview > .match > .m-table:nth-child(${currentLeaguePick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)
    //     await page.click(`.m-overview > .match > .m-table:nth-child(${currentLeaguePick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)

    // } else {
    //     console.log(`Game time not reached  - ${currentTime} minutes`)
    // }
