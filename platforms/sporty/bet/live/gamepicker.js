/*
 * GamePicker
 * Picks a single game (randomly).
 * @kwekukankam - chancebot 2021
 */
var PlaceBetOneXTwo = require("./placebetonextwo");
var PlaceBetReverse = require("./placebetreverse");
var reverseBetShore = require("./reversebetshore");
const activeGameLog = require("../../../../managers/log/activegameslog");
const logArchitect = require("../../../../managers/log/architect");
GamePicker = {}

/*
 * Gets the full list of games and picks one randomly.
 * Does some validations on picked game and logs 
 * various data on picked game.
 */
GamePicker.pickGame = async (page) => {

    try {
        const navigationPromise = page.waitForNavigation();
        await navigationPromise;

        // //click on efootball(test)
        // await page.waitForSelector('div > .m-overview > .sport-name > .sport-name-item:nth-child(1) > .text')
        // await page.click('div > .m-overview > .sport-name > .sport-name-item:nth-child(1) > .text')

        //get total live leagues available
        await page.waitForSelector('.m-overview > .match > .m-table')
        const data = await page.evaluate(() => {
            const wrapper = Array.from(document.querySelectorAll('.m-overview > .match > .m-table'))
            return wrapper.length;
        });
        // console.log("data : " + data);
        //loop through each live league
        mainLoop:
        for (let i = 1; i <= data; i++) {
            //get count of games available for a picked league
            const gameCount = await page.evaluate((val) => {
                //we change to match row to test something (original m-table-row)
                const wrapper = Array.from(document.querySelectorAll(`.m-overview > .match > .m-table:nth-child(${val}) > .match-row`))
                return wrapper.length;
            }, i);

            for (let j = 1; j <= gameCount; j++) {
                const gameOdd = await pickMarket(i, j, page);
                const gameInfo = await pickedGameInfo(page, i, j);

                if (gameOdd[0] != 0) {

                    const isBet = await revBetShore(gameOdd);
                    if (isBet[0] == 1 /*true*/) {
                        
                        //now check if bet has been place for this game before
                        if (activeGameLog.verifyGame(gameInfo.gameid) == true && gameInfo.minutesplayed < 30) {
                            //add to log
                            activeGameLog.additem(gameInfo.gameid);
                            //low odd
                            const lowBet = await PlaceBetReverse.live(page, 1/*isBet[1].low.betamt bet amount*/, isBet[1].low.odd/*odds value*/, i, j, checktype(isBet[1].low.type));

                            if (lowBet == 1) {
                                const highbet = await PlaceBetReverse.live(page, 1/*isBet[1].low.betamt bet amount*/, isBet[1].high.odd/*odds value*/, i, j, checktype(isBet[1].high.type));
                                if (highbet == 1) {
                                    var bSuccess = {
                                        "msg":betSuccess,
                                        "gameinfo":gameInfo,
                                        "betinfo":isBet[1]
                                    }
                                    logArchitect.addItem({data:bSuccess})
                                    
                                    PlaceBetReverse.live(page, 1/*isBet[1].low.betamt bet amount*/, isBet[1].draw.odd/*odds value*/, i, j, 2);
                                    // we log succesfull bets here

                                }

                            } else {
                                break mainLoop;
                            }

                            break mainLoop;
                        }else{
                            logArchitect.addConsoleItem({"activegamelog":activeGameLog.showLogs()});
                            }
                    } else { }
                }

            }

        }
    } catch (error) {
        logArchitect.addConsoleItem({"msg":"Navigation Error","error":error});
    }
}

/*
 * converts home away values to 1x2
 */
function checktype(type) {
    if (type == "home") return 1;
    if (type == "away") return 3;
}
function revBetShore(odds) {
    let drawObj = {
        "draw": odds[1],
        "home": odds[0],
        "away": odds[2],
        "betamt": 10,
        "losspercent": 50
    }

    var revbshore = reverseBetShore.run(drawObj)
    //show only positives -- todo greater than 2gh
    if (revbshore.outcome.status == "positive") {
        return [1, revbshore];
    } else {
         return [0];
    }
}

/*
 * Gets Game info from picked game and adds to log
 */
async function pickedGameInfo(page, currentleague, currentgame) {
    let rowval = (currentgame == 1) ? ".match-row" : `.match-row:nth-child(${currentgame})`;
    const currentTime = await timerCheck(currentleague,currentgame, page);
    let gameInfoObj = {}
    const homeTeam = await page.$eval(`.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .teams > .home-team`, el => el.innerHTML);
    const awayTeam = await page.$eval(`.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .teams > .away-team`, el => el.innerHTML);
    const homeScore = await page.$eval(`.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .score > .score-item:nth-child(1)`, el => el.innerHTML);
    const awayScore = await page.$eval(`.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .score > .score-item:nth-child(2)`, el => el.innerHTML);
    const leagueName = await page.$eval(`.m-overview > .match > .m-table:nth-child(${currentleague}) > .m-table-row > .league`, el => el.innerHTML);
    gameInfoObj = {
        "leaguename": leagueName,
        "home": homeTeam.trim(),
        "away": awayTeam.trim(),
        "homescore": homeScore.trim(),
        "awayscore": awayScore.trim(),
        "gameid": homeTeam + "_" + awayTeam,
        "minutesplayed": currentTime
    }
    // console.log(gameInfoObj);
    return gameInfoObj;

}

async function timerCheck(currentLeaguePick,currentgame, page) {
    let rowval = (currentgame == 1) ? ".match-row" : `.match-row:nth-child(${currentgame})`;
    const matchTime = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > ${rowval} > .m-table-cell > .left-team-table > .time > .clock-time`, el => el.innerHTML);

    let tVal = matchTime.trim().split(":")
    return parseInt(tVal[0].trim());
}

async function pickMarket(currentleague, currentgame, page) {
    let oddArr = [];
    const homeOdd = await singleOdd(page, currentleague, currentgame, 1)
    const drawOdd = await singleOdd(page, currentleague, currentgame, 2)
    const awayOdd = await singleOdd(page, currentleague, currentgame, 3)
    oddArr = [homeOdd, drawOdd, awayOdd]
    return oddArr;
}

//Strategies
async function lowOddHighStake(page, oddArr, currentleague, currentgame) {
    // lets check the scores too 
    await goalChecker(page, currentleague)
    //find minimum value in addArr
    const min = Math.min(...oddArr).toFixed(2)
    let minPosition = oddArr.indexOf(min.toString())
    if (min > 1.06 && min < 4.10) {
        console.log("Found Correct Range value " + min)
        const res = [0, min, minPosition + 1]
        return res;
    } else {
        const res = [1];
        return res;
    }

}

async function singleOdd(page, currentleague, currentgame, outcomechild) {
    // console.log(`${currentleague} ${currentgame} ${outcomechild}`);
    return await page.evaluate((j, k, l) => {
        let rowval = (k == 1) ? ".match-row" : `.match-row:nth-child(${k})`;
        const wrapper = document.querySelector(`.m-table:nth-child(${j}) > ${rowval} > .m-table-cell > .m-market:nth-child(1) > .m-outcome:nth-child(${l}) > .m-outcome-odds`)
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

async function goalChecker(page, currentLeaguePick) {
    const homeScore = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .score > .score-item:nth-child(1)`, el => el.innerHTML);
    const awayScore = await page.$eval(`.m-table:nth-child(${currentLeaguePick}) > .m-table-row > .m-table-cell > .left-team-table > .score > .score-item:nth-child(2)`, el => el.innerHTML);
    let goalDiff = parseInt(homeScore.trim()) - parseInt(awayScore.trim())
    if (goalDiff < 0) {
        goalDiff = goalDiff * -1;

    }
    console.log("Diff " + goalDiff)
}

module.exports = GamePicker
