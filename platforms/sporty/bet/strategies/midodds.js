/*
 * GamePicker - Mid Odds low Stake
 * Places a net on a mid betting range
 * @kwekukankam - chancebot 2021
 */
const PlaceBet = require("../live/placebet");
const activeGameLog = require("../../../../managers/log/activegameslog");
const logArchitect = require("../../../../managers/log/architect");
var accountResource = require("../../account/accountmanager");
var dotenv = require("dotenv");

dotenv.config();

GamePicker = {};

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
    await page.waitForSelector(".m-overview > .match > .m-table");
    const data = await page.evaluate(() => {
      const wrapper = Array.from(
        document.querySelectorAll(".m-overview > .match > .m-table")
      );
      return wrapper.length;
    });

    const betverify = await accountResource.BetBalanceVerify(page);
    console.log(betverify);
    //loop through each live league
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

      for (let j = 1; j <= gameCount; j++) {
        const gameOdd = await pickMarket(i, j, page);
        const gameInfo = await pickedGameInfo(page, i, j);
        if (gameOdd[0] != 0) {
          const bLow = await lowOddHighStake(gameOdd);
          console.log(bLow);
          if (bLow[0] == 0 && bLow[2] != 2) {
            //place bet
            if (activeGameLog.verifyGame(gameInfo.gameid) == true) {
              if (betverify.code == "002") {
                // place bet
                const placedBet = await PlaceBet.live(
                  page,
                  2 /*bet amt*/,
                  bLow[1] /*odds value*/,
                  i,
                  j,
                  bLow[2]
                );
                //finally log
                if (placedBet == 1) {
                  //add log
                  activeGameLog.additem(gameInfo.gameid);
                  var bSuccess = {
                    msg: "Bet Successfull",
                    gameinfo: gameInfo,
                    betodds: gameOdd
                  };
                  logArchitect.addItem({ data: bSuccess });
                }
                break mainLoop;
              } else {
                logArchitect.addConsoleItem({
                  msg: "Bet Range Ecxeeded",
                  "Bet Difference": betverify.betdiff
                });
                break mainLoop;
              }
            } else {
              logArchitect.addConsoleItem({
                activegamelog: activeGameLog.showLogs()
              });
            }
          } else {
            logArchitect.addConsoleItem({
              msg: "No bet match for this iteration"
            });
          }
        }
      }
    }
  } catch (error) {
    logArchitect.addConsoleItem({
      msg: "Navigation Error",
      error: error.toString()
    });
    await page.reload();
  }
};

/*
 * Gets Game info from picked game and adds to log
 */
async function pickedGameInfo(page, currentleague, currentgame) {
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
    home: homeTeam.trim(),
    away: awayTeam.trim(),
    homescore: homeScore.trim(),
    awayscore: awayScore.trim(),
    gameid: homeTeam + "_" + awayTeam,
    minutesplayed: currentTime
  };
  // console.log(gameInfoObj);
  return gameInfoObj;
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

async function pickMarket(currentleague, currentgame, page) {
  let oddArr = [];
  const homeOdd = await singleOdd(page, currentleague, currentgame, 1);
  const drawOdd = await singleOdd(page, currentleague, currentgame, 2);
  const awayOdd = await singleOdd(page, currentleague, currentgame, 3);
  oddArr = [homeOdd, drawOdd, awayOdd];
  return oddArr;
}

//Strategies
async function lowOddHighStake(oddArr) {
  // lets check the scores too
  // await goalChecker(page, currentleague)
  //find minimum value in addArr
  const min = Math.min(...oddArr).toFixed(2);
  let minPosition = oddArr.indexOf(min.toString());
  if (min > 1.4 && min < 1.6) {
    const res = [0, min, minPosition + 1];
    return res;
  } else {
    const res = [1];
    return res;
  }
}

async function singleOdd(page, currentleague, currentgame, outcomechild) {
  // console.log(`${currentleague} ${currentgame} ${outcomechild}`);
  return await page.evaluate(
    (j, k, l) => {
      let rowval = k == 1 ? ".match-row" : `.match-row:nth-child(${k})`;
      const wrapper = document.querySelector(
        `.m-table:nth-child(${j}) > ${rowval} > .m-table-cell > .m-market:nth-child(1) > .m-outcome:nth-child(${l}) > .m-outcome-odds`
      );
      if (wrapper != null) {
        let v = parseFloat(wrapper.innerHTML);
        if (isNaN(v)) {
          return 0;
        } else {
          return wrapper.innerHTML;
        }
      } else {
        return 0;
      }
    },
    currentleague,
    currentgame,
    outcomechild
  );
}

module.exports = GamePicker;
