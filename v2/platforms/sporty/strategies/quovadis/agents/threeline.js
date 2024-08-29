const { gameInfo } = require("../../polaris/placebet");
var { delay } = require("../../../../../config/browser");
var State = require("./index");

const Threeline = {};

Threeline.start = async (page) => {
  try {
    //close sporty adverts
    closeSportyAds(page);

    await delay(5000);
    clearPreviousBets(page);
    //click live games
    //toViewAllLiveGames(page);
    // loop though all live gaves and pick suitable options
    // pickLiveGame(page);
    // await delay(2000);
    // placeBet(page);
  } catch (error) {
    console.log(error);
  }
};

const placeBet = async (page) => {
  console.log("placing bet");
  await page.waitForSelector(
    ".m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon"
  );
  //console.log(tts)
  await page.click(
    ".m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon"
  );
  await delay(1000);
  await page.waitForSelector(
    ".m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count"
  );
  await page.click(
    ".m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count"
  );
  await delay(2000);
  await page.waitForSelector(
    ".m-betslips-stake-wrapper > .m-betslips-stake > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input"
  );
  await page.click(
    ".m-betslips-stake-wrapper > .m-betslips-stake > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input"
  );
  await delay(1000);
  await page.waitForSelector(
    ".mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .action"
  );
  await page.click(
    ".mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .action"
  );

  let amount = 1.2 + "";
  if (amount[amount.length - 1] === "0" && amount.includes(".")) {
    let str = amount.split("");
    str[amount.length - 1] = "1";
    amount = str.join("");
  }

  for (let ch of amount) {
    ch = ch == "." ? "d" : parseInt(ch, 10);
    await delay(500);
    if (ch !== 0 && ch <= 6) {
      await page.waitForSelector(
        `.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`
      );

      await page.click(
        `.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(${ch})`
      );
    }
    if (ch === 0 || ch > 6 || ch === "d") {
      //mappin
      const kMaps = { 7: "1", 8: "2", 9: "3", 0: "4", d: "5" };

      await page.waitForSelector(
        `.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`
      );
      await page.click(
        `.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(${kMaps[ch]})`
      );
    }
  }

  //click done
  await delay(500);
  await page.waitForSelector(
    ".m-betslips-stake > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .right"
  );
  await page.click(
    ".m-betslips-stake > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .right"
  );
  await delay(1000);
  await page.waitForSelector(
    ".m-betslips-stake-wrapper > .m-betslips-stake > .m-submit > .place-bet > .m-pay-num"
  );
  await page.click(
    ".m-betslips-stake-wrapper > .m-betslips-stake > .m-submit > .place-bet > .m-pay-num"
  );
  await delay(1000);
  await page.waitForSelector(
    ".m-bet-detail-wrap > div > .confirm-wrap > .button-wrap > .flexibet-confirm"
  );
  await page.click(
    ".m-bet-detail-wrap > div > .confirm-wrap > .button-wrap > .flexibet-confirm"
  );
};

const toViewAllLiveGames = async (page) => {
  console.log("to live games");
  try {
    await page.waitForSelector(
      ".m-bet-tab > div > .m-bet-content > .view-all > a"
    );
    await page.click(".m-bet-tab > div > .m-bet-content > .view-all > a");
  } catch (e) {
    // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
  }
};

const closeSportyAds = async (page) => {
  console.log("close ads");
  try {
    await page.waitForSelector(
      ".m-act-pop > .es-dialog-body > .es-dialog-main > .m-act-wrapper > .m-icon-close"
    );
    await page.click(
      ".m-act-pop > .es-dialog-body > .es-dialog-main > .m-act-wrapper > .m-icon-close"
    );
  } catch (e) {
    // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
  }
};

const clearPreviousBets = async (page) => {
  console.log("Clearing All previous bets");
  try {
    await page.waitForSelector(`[data-op*="close_guide_button"]`, {
      timeout: 0,
    });
    await page.click(`[data-op*="close_guide_button"]`);

    await page.waitForSelector(
      ".m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon"
    );
    await page.click(
      ".m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon"
    );

    await delay(3000);

    const betCount = await page.$eval(
      `.m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count`,
      (el) => el.innerHTML
    );
    if (parseInt(betCount) > 0) {
      console.log("we have a big bumber");
      await delay(1000);
      await page.waitForSelector(
        ".m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count"
      );
      await page.click(
        ".m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count"
      );
      await delay(1000);
      await page.waitForSelector(
        ".m-betslip-header > .head-container > .wrapper > .remove-all"
      );
      await page.click(
        ".m-betslip-header > .head-container > .wrapper > .remove-all"
      );
      await delay(1000);
      await page.waitForSelector(
        ".es-dialog-wrap > .es-dialog > .m-dialog-footer > a.es-dialog-btn:nth-child(2)"
      );
      await page.click(
        ".es-dialog-wrap > .es-dialog > .m-dialog-footer > .es-dialog-btn:nth-child(2)"
      );
      await delay(1000);
      await page.waitForSelector(
        ".m-betslip-header > .head-container > .wrapper > .wrapper-item > .icon-font-base"
      );
      await page.click(
        ".m-betslip-header > .head-container > .wrapper > .wrapper-item > .icon-font-base"
      );
    }
  } catch (e) {
    console.log(e.toString());
    // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
  }
};

const pickLiveGame = async (page) => {
  const navigationPromise = page.waitForNavigation();
  await navigationPromise;
  //get total live leagues available
  await page.waitForSelector(".m-bet-content > .m-league");
  const data = await page.evaluate(() => {
    const wrapper = Array.from(
      document.querySelectorAll(".m-bet-content > .m-league")
    );
    return wrapper.length;
  });
  mainLoop: for (let i = 1; i <= data; i++) {
    //get count of games available for a league
    const gameCount = await page.evaluate((val) => {
      const wrapper = Array.from(
        document.querySelectorAll(
          `.m-bet-content > .m-league:nth-child(${val}) > .m-league-conent > .m-table > .m-event-live`
        )
      );
      return wrapper.length;
    }, i);

    //build games which meet agents criteria
    for (let j = 1; j <= gameCount; j++) {
      const gameInfo = await gameBuilder(page, i, j);
      if (gameInfo === true) break mainLoop;
    }
  }

  const pickedGame = await toPickedGame(page);
  await delay(2000).then(() => {
    pickMarket(page, pickedGame);
  });
};

//build an array of games which meet current agent's criteria
//these criteria refers to the game agents criteria
const gameBuilder = async (page, currentleague, currentgame) => {
  try {
    // const currentTime = await timerCheck(currentleague, currentgame, page);
    let gameInfoObj = {};
    const homeTeam = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-table-row > .m-info-cell > .team`,
      (el) => el.innerHTML
    );
    const awayTeam = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-table-row > .m-info-cell > .team:nth-child(2)`,
      (el) => el.innerHTML
    );

    const homeScore = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-table-row > .score > .set-score`,
      (el) => el.innerHTML
    );

    const awayScore = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-table-row > .score > .set-score:nth-child(2)`,
      (el) => el.innerHTML
    );

    const leagueName = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-title > .text`,
      (el) => el.innerHTML
    );

    const gameTime = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-event-meta > .m-event-time`,
      (el) => el.innerHTML
    );

    const gameHalf = await page.$eval(
      `.m-bet-content > .m-league:nth-child(${currentleague}) > .m-league-conent > .m-table > .m-event-live:nth-child(${currentgame}) > .m-event-meta > .match-status`,
      (el) => el.innerHTML
    );

    gameInfoObj = {
      leagueName,
      id: (homeTeam + "_" + awayTeam).replace(/\s+/g, ""),
      hometeam: homeTeam.trim(),
      awayteam: awayTeam.trim(),
      currentscore: { home: homeScore.trim(), away: awayScore.trim() },
      gameTime: parseInt(gameTime.trim().split(":")[0].trim()),
      gameHalf,
      position: [currentleague, currentgame],
      prisonCount: 0,
      //   currentHalf: currentTime <= 45 ? "H1" : "H2",
    };
    //setup game agent rules and verify with gameInfoObj
    if (
      gameInfoObj.gameTime >= process.env.THREELINE_MINTIME &&
      gameInfoObj.gameTime <= process.env.THREELINE_MAXTIME &&
      gameInfoObj.gameTime != 45
    ) {
      //add game to picked game - todo check if a game is part of activegames
      //if this is the case we move to to the next game
      const isErrorPick = findObjectById(
        State.getState("pickedErrorGame"),
        gameInfoObj["id"]
      );
      State.setState("pickedGame", gameInfoObj);
      if (isErrorPick) {
      } else {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log("Process.js : pickedGameInfo Error");
    console.log(e.toString());
  }
};

const toPickedGame = async (page) => {
  try {
    //get a random active game
    const pickedGame = State.pickedGame;
    if (pickedGame) {
      await page.waitForSelector(
        `.m-bet-content > .m-league:nth-child(${pickedGame.position[0]}) > .m-league-conent > .m-table > .m-event-live:nth-child(${pickedGame.position[1]}) > .m-table-row > .m-info-cell`
      );
      await page.click(
        `.m-bet-content > .m-league:nth-child(${pickedGame.position[0]}) > .m-league-conent > .m-table > .m-event-live:nth-child(${pickedGame.position[1]}) > .m-table-row > .m-info-cell`
      );
    }
    return pickedGame;
  } catch (e) {
    console.log("Process.js : TopickedGame Error");
    console.log(e.toString());
  }
};

const pickMarket = async (page, pickedGame) => {
  try {
    // click on all markets
    await page.waitForSelector(
      ".m-event-detail-wrap > .live-match > .m-snap-nav-wrap > .m-snap-nav > .m-sport-group-item:nth-child(2)"
    );
    await page.click(
      ".m-event-detail-wrap > .live-match > .m-snap-nav-wrap > .m-snap-nav > .m-sport-group-item:nth-child(2)"
    );

    //build the three line object
    const overunderLines = await page.evaluate(() => {
      const wrapper = Array.from(
        document.querySelectorAll(
          `.m-sport-market > div:nth-child(2) > .m-market > .m-table > .m-table-row`
        )
      );
      return wrapper.length;
    });
    let lineArr = [];
    for (let i = 2; i <= overunderLines; i++) {
      try {
        const k = await page.$eval(
          `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(${i}) > .m-table-cell:nth-child(1) > em`,
          (el) => el.innerHTML ?? 0
        );
        const l = await page.$eval(
          `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(${i}) > .m-table-cell:nth-child(2) > em`,
          (el) => el.innerHTML ?? 0
        );
        const m = await page.$eval(
          `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(${i}) > .m-table-cell:nth-child(3) > em`,
          (el) => el.innerHTML ?? 0
        );
        lineArr.push({
          line: k.trim(),
          over: l.trim(),
          under: m.trim(),
          position: i,
        });
      } catch (error) {}
    }
    //analyze and pick the right odds
    const pickedLineArr = findLowestUnderValue(lineArr, 1.01, 1.8);
    //when no value is found, do something
    console.log("line Arr", pickedLineArr);
    if (!pickedLineArr) {
      // we have to store in error game market array
      console.log("able");
      pickedGame["prisonCount"] = 1;
      const gameErrorArr = replaceAndUpdateObject(
        State.pickedErrorGame,
        pickedGame,
        "id",
        "prisonCount"
      );
      console.log(gameErrorArr);
      State.setState("pickedErrorGame", gameErrorArr);
    } else {
      await page
        .locator(
          `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(${pickedLineArr.position}) > .m-table-cell:nth-child(3) > em`
        )
        .click();
      //done
      await delay(1000);

      // await placeBet(page);
    }
  } catch (error) {
    console.log("Threeline : unable To pick market");
    console.log(error.toString());
  }
};

function findLowestUnderValue(array, min, max) {
  // Skip the first item
  const filteredArray = array.slice(1);

  // Filter items based on min and max under values
  const validItems = filteredArray.filter((item) => {
    const underValue = parseFloat(item.under);
    return underValue >= min && underValue <= max;
  });

  // Find the item with the lowest under value
  if (validItems.length > 0) {
    return validItems.reduce((lowest, current) => {
      const lowestUnder = parseFloat(lowest.under);
      const currentUnder = parseFloat(current.under);
      return lowestUnder < currentUnder ? lowest : current;
    });
  } else {
    // No valid items found
    return null;
  }
}

function findObjectById(array, objectId) {
  return array.find((obj) => obj.id === objectId);
}

function replaceAndUpdateObject(array, newObject, key, valueKey) {
  const index = array.findIndex((obj) => obj[key] === newObject[key]);

  if (index !== -1) {
    const oldValue = array[index][valueKey];
    if (oldValue < 5) {
      array[index][valueKey]++;
    } else {
      array.splice(index, 1);
    }
  } else {
    array.push(newObject);
  }
  return array;
}

module.exports = Threeline;
