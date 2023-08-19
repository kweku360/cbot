var State = require("../../../../state");
var PlaceBet = require("./placebet");

const Process = {}

Process.pickGame = async (page) => {
    //get total live leagues available
    await page.waitForSelector(".m-overview > .match > .m-table");
    const data = await page.evaluate(() => {
        const wrapper = Array.from(
            document.querySelectorAll(".m-overview > .match > .m-table")
        );
        return wrapper.length;
    });
    mainLoop: for (let i = 1; i <= data; i++) {
        //get count of games available for a picked league
        const gameCount = await page.evaluate((val) => {
            //we change to match row to test something (original m-table-row)
            const wrapper = Array.from(
                document.querySelectorAll(
                    `.m-overview > .match > .m-table:nth-child(${val}) > .match-row`
                )
            );
            return wrapper.length;
        }, i);
        //clicks on a particular game
        for (let j = 1; j <= gameCount; j++) {
            const gameInfo = await pickedGameInfo(page, i, j);
            State.setState("activeGame", [...State.activeGame, gameInfo]);
        }
    }

    toActiveGame(page);
    page.waitForTimeout(3000).then(() => {
        pickMarket(page);
    })
}

const toActiveGame = async (page) => {
    try {
        //get active game
        // const activeGame = State.activeGame.find(x => x.active === true);
        const activeGame = State.activeGame[Math.floor(Math.random() * State.activeGame.length)];
        console.log(activeGame)
        if (activeGame) {
            await page.waitForSelector(`.m-table-row:nth-child(${activeGame.meta.position[1] + 1}) > .m-table-cell > .left-team-table > .teams > .home-team`)
            await page.click(`.m-table-row:nth-child(${activeGame.meta.position[1] + 1}) > .m-table-cell > .left-team-table > .teams > .home-team`)
            //move active to the next position
        }
    } catch (e) {
        console.log(e.toString());
        // logArchitect.addConsoleItem({"msg":"Multiple bet Click Error","error":e.toString()});
    }
};

const pickMarket = async (page) => {
    try {
        //get count of markets
        await page.waitForSelector('.m-detail-wrapper > .m-table__wrapper')
        const marketcount = await page.evaluate(() => {
            const wrapper = Array.from(document.querySelectorAll('.m-detail-wrapper > .m-table__wrapper'))
            return wrapper.length;
        });

        //we do some logging
        // console.log("total markets  " + marketcount + "\n");

        //Loop through marketcount 
        for (var i = 1; i < marketcount; i++) {
            let marketCountItem = i;
            const outcome = await page.evaluate((marketCountItem) => {
                const wrapper = Array.from(document.querySelectorAll(`.m-detail-wrapper > .m-table__wrapper:nth-child(${marketCountItem}) > .m-table:nth-child(2) > .m-outcome > .m-table-cell`))
                return wrapper.length;
            }, marketCountItem);
            //inner loop to get odds value.
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
                const marketName = await page.$eval(
                    `.m-table__wrapper:nth-child(${outcome}) > .m-table > .m-table-row > .m-table-cell > .m-table-header-title`,
                    (el) => el.innerHTML
                );
                // console.log(marketName)
                // console.log(checkOdds);
                //check for odds range and place bet
                if (checkOdds >= 1.01 && checkOdds <= 1.03) {

                    // console.log("Found Correct Range value " + checkOdds)

                    //place bet is called
                    PlaceBet.live(page, 5 /*bet amount*/, checkOdds/*odds value*/, marketCountItem, k /*offset*/);

                    return;
                }
            }
        }

    } catch (error) {
        console.log(error.toString())
    }
}

/*
 * Gets Game info from picked game and adds to log
 */
async function pickedGameInfo(page, currentleague, currentgame) {
    try {
        let rowval =
            currentgame == 1 ? ".match-row" : `.match-row:nth-child(${currentgame})`;
        const currentTime = await timerCheck(currentleague, currentgame, page);
        let gameInfoObj = {};
        const homeTeam = await page.$eval(
            `.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .teams > .home-team`,
            (el) => el.innerHTML
        );
        const awayTeam = await page.$eval(
            `.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .teams > .away-team`,
            (el) => el.innerHTML
        );
        const homeScore = await page.$eval(
            `.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .score > .score-item:nth-child(1)`,
            (el) => el.innerHTML
        );
        const awayScore = await page.$eval(
            `.m-table:nth-child(${currentleague}) > ${rowval} > .m-table-cell > .left-team-table > .score > .score-item:nth-child(2)`,
            (el) => el.innerHTML
        );
        const leagueName = await page.$eval(
            `.m-overview > .match > .m-table:nth-child(${currentleague}) > .m-table-row > .league`,
            (el) => el.innerHTML
        );
        gameInfoObj = {
            leaguename: leagueName,
            id: (homeTeam + "_" + awayTeam).replace(/\s+/g, ''),
            hometeam: homeTeam.trim(),
            awayteam: awayTeam.trim(),
            currentscore: { home: homeScore.trim(), away: awayScore.trim() },
            currentTime,
            currentHalf: currentTime <= 45 ? "H1" : "H2",
            active: (currentleague === 1 && currentgame === 1) ? true : false,
            meta: {
                visitedcount: 0,
                position: [currentleague, currentgame],
                islocked: false,
            }
        };
        // console.log(gameInfoObj);
        return gameInfoObj;
    } catch (e) {
        console.log(e.toString());
    }
}

async function timerCheck(currentLeaguePick, currentgame, page) {
    let rowval =
        currentgame == 1 ? ".match-row" : `.match-row:nth-child(${currentgame})`;
    const matchTime = await page.$eval(
        `.m-table:nth-child(${currentLeaguePick}) > ${rowval} > .m-table-cell > .left-team-table > .time > .clock-time`,
        (el) => el.innerHTML
    );

    let tVal = matchTime.trim().split(":");
    return parseInt(tVal[0].trim());
}

module.exports = Process