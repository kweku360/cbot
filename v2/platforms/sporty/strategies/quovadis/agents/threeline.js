const { gameInfo } = require("../../polaris/placebet");
var { delay, getPuppeteerInstance } = require("../../../../../config/browser");
var State = require("./index");
const PageApi = require("../facade/pageapi");
const QuovadisDb = require("../db/index");
const { generateUniqueId } = require("../utils/uuid");
const placeBet = require("../agents/common/placebet");
const {
  buildGameInfo,
  buildGameInfoPreMatch,
} = require("../agents/common/gamebuilder");

const Threeline = {};

Threeline.start = async (page) => {
  try {
    const checkBalance = await checkAccountBalance(page);
    if (checkBalance) {
      await closeSportyAds(page);
      await toNext3Hours(page);
      //find out if the current game has already been processed.
      for (let i = 2; i < 10; i++) {
        await PageApi.delay(2000);
        const gameInfo = await buildGameInfoPreMatch(page, i, 1);
        const gameDoc = await QuovadisDb.getDocument(gameInfo["id"]);
        if (gameDoc === false) {
          console.log("game Identified Placing Bet", gameInfo);
          if (gameInfo.id !== "NoItem") {
            await PageApi.delay(2000);
            await PageApi.find("gameClick", page, {
              replacementArr: [i],
            });
            await PageApi.click("gameClick", page, {
              replacementArr: [i],
            });
            await processStart(page, gameInfo);
            return;
          }
        }
      }
    } else {
      console.log("Balance threshold reached.");
    }
  } catch (error) {
    console.log(error);
  }
};

const toNext3Hours = async (page) => {
  console.log("toNext3Hours: navigating to next 3 hours of games...");
  await PageApi.find("next3Hours", page);
  await PageApi.click("next3Hours", page);
};

const processStart = async (page, gameInfo) => {
  try {
    //todo add logic
    await delay(1000);
    await PageApi.find("winningMargin", page);
    await PageApi.click("winningMargin", page);

    //check for winning margin and save for error val
    const winningMargin = await PageApi.getText("winningMargin", page);
    if (winningMargin === null || winningMargin !== "Winning Margin") {
      //store in db and return
      console.log("winning margin market not found");
      const doc = {
        _id: gameInfo["id"],
        data: gameInfo,
      };
      await QuovadisDb.saveDocument(doc);
      return;
    }
    await PageApi.delay(2000);

    //click on first 3
    for (let i = 1; i <= 1; i++) {
      await page.waitForSelector(
        `div:nth-child(1) > .m-market > .m-table > .m-table-row:nth-child(1) > .m-table-cell:nth-child(${i}) > em:nth-child(1)`
      );
      await page.click(
        `div:nth-child(1) > .m-market > .m-table > .m-table-row:nth-child(1) > .m-table-cell:nth-child(${i}) > em:nth-child(1)`
      );
    }
    //click on bottom 3
    for (let i = 1; i <= 1; i++) {
      await delay(1000);
      await page.waitForSelector(
        `div > .m-market > .m-table > .m-table-row:nth-child(2) > .m-outcome-three:nth-child(${i})`
      );
      await page.click(
        `div > .m-market > .m-table > .m-table-row:nth-child(2) > .m-outcome-three:nth-child(${i})`
      );
    }
    //click to expand betslip
    await page.waitForSelector("#fast-mul-betslip");
    await page.click("#fast-mul-betslip");

    const bAmt = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

    await placeBet(page, gameInfo);
  } catch (error) {
    console.log(error);
  }
};

const closeSportyAds = async (page) => {
  console.log("closeSportyAds: closing sporty ads if any...");
  await PageApi.find("closeSportyAd", page);
  await PageApi.click("closeSportyAd", page);
};

const clearPreviousBets = async (page) => {
  console.log("clearPreviousBets: clearing previous bets if any...");
  // await PageApi.find("sportyPopUps", page);
  // await PageApi.click("sportyPopUps", page);
  await PageApi.find("closeFastbetSlip", page);
  await PageApi.click("closeFastbetSlip", page);
  const betCount = await PageApi.getText("expandCurrentBet", page);
  if (parseInt(betCount) > 0) {
    await PageApi.find("expandCurrentBet", page);
    await PageApi.click("expandCurrentBet", page);
    await PageApi.find("removeAllbets", page);
    await PageApi.click("removeAllbets", page);
    await PageApi.find("removeAllbets", page);
    await PageApi.click("removeAllbets", page);
    await PageApi.find("confirmRemoveAllbets", page);
    await PageApi.click("confirmRemoveAllbets", page);

    await PageApi.find("clearPopupBg", page);
    await PageApi.click("clearPopupBg", page);
  }
};

const pickLiveGame = async (page) => {
  //get total live leagues available
  await PageApi.find("liveLeagueCount", page);
  const data = await PageApi.findArrayCount("liveLeagueCount", page);

  mainLoop: for (let i = 1; i <= data; i++) {
    //get count of games available for a league
    const gameCount = await PageApi.findArrayCount(
      "liveLeagueGameCount",
      page,
      { replacementArr: [i] }
    );
    //build games which meet agents criteria
    for (let j = 1; j <= gameCount; j++) {
      const gameInfo = await gameBuilder(page, i, j);
      if (gameInfo === true) break mainLoop;
    }
  }
  if (State.getState("pickedGame").length !== 0) {
    const pickedGame = await toPickedGame(page);
    await delay(2000).then(() => {
      pickMarket(page, pickedGame);
    });
  }
};

//build an array of games which meet current agent's criteria
//these criteria refers to the game agents criteria
const gameBuilder = async (page, currentleague, currentgame) => {
  let gameInfoObj = await buildGameInfo(page, currentleague, currentgame);

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
    const id = generateUniqueId(gameInfoObj["id"]);
    const gameDoc = await QuovadisDb.getDocument(id);
    // console.log("isErrorPick",isErrorPick)
    if (gameDoc === false && isErrorPick === undefined) {
      State.setState("pickedGame", gameInfoObj);
      return true;
    } else {
    }
  }
  return false;
};

const toPickedGame = async (page) => {
  //get a random active game
  const pickedGame = State.getState("pickedGame");
  if (pickedGame) {
    await PageApi.find("pickedGame", page, {
      replacementArr: [pickedGame.position[0], pickedGame.position[1]],
    });
    await PageApi.click("pickedGame", page, {
      replacementArr: [pickedGame.position[0], pickedGame.position[1]],
    });
  }
  return pickedGame;
};

const pickMarket = async (page, pickedGame) => {
  // click on all markets
  await PageApi.find("allGameMarkets", page);
  await PageApi.click("allGameMarkets", page);

  //build the three line object
  const overunderLines = await PageApi.findArrayCount("overUnderLine", page);
  let lineArr = [];
  for (let i = 2; i <= overunderLines; i++) {
    try {
      const k = await PageApi.getText("overUnderLineItem", page, {
        replacementArr: [i],
      });
      const l = await PageApi.getText("overLineValue", page, {
        replacementArr: [i],
      });
      const m = await PageApi.getText("underLineValue", page, {
        replacementArr: [i],
      });
      lineArr.push({
        line: k.trim(),
        over: l.trim(),
        under: m.trim(),
        position: i,
      });
    } catch (error) {}
  }
  //analyze and pick the right odds
  const pickedLineArr = findLowestUnderValue(
    lineArr,
    process.env.THREELINE_MINODD,
    process.env.THREELINE_MAXODD
  );
  //when no value is found, do something
  console.log("line Arr", pickedLineArr);
  if (!pickedLineArr) {
    // we have to store in error game market array
    pickedGame["prisonCount"] = 1;

    const gameErrorArr = replaceAndUpdateObject(
      State.pickedErrorGame,
      pickedGame,
      "id",
      "prisonCount"
    );
    State.setState("pickedErrorGame", gameErrorArr);
  } else {
    // lets clear outstanding bets first
    await clearPreviousBets(page);
    await delay(3000);
    await PageApi.find("selectLineValue", page, {
      replacementArr: [pickedLineArr.position],
    });
    await PageApi.click("selectLineValue", page, {
      replacementArr: [pickedLineArr.position],
    });
    //done
    pickedGame["line"] = pickedLineArr;
    await delay(1000);

    await placeBet(page, pickedGame);
  }
};

const checkAccountBalance = async (page) => {
  const amt = await PageApi.getText("accountBalanceAmount", page);
  console.log(amt);
  if (parseInt(amt.trim(), 10) < 0.1) {
    return false;
  }
  return true;
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
