const { gameInfo } = require("../../polaris/placebet");
var { delay } = require("../../../../../config/browser");
var State = require("./index");
const PageApi = require("../facade/pageapi");
const QuovadisDb = require("../db/index");
const { generateUniqueId } = require("../utils/uuid");
const placeBet = require("../agents/common/placebet");
const buildGameInfo = require("../agents/common/gamebuilder");

const Threeline = {};

Threeline.start = async (page) => {
  try {
    const checkBalance = await checkAccountBalance(page);
    if (checkBalance) {
      await closeSportyAds(page);
      await toViewAllLiveGames(page);
      await pickLiveGame(page);
    } else {
      console.log("Balance threshold reached.");
    }
  } catch (error) {
    console.log(error);
  }
};

const toViewAllLiveGames = async (page) => {
  await PageApi.find("allLiveGames", page);
  await PageApi.click("allLiveGames", page);
};

const closeSportyAds = async (page) => {
  await PageApi.find("closeSportyAd", page);
  await PageApi.click("closeSportyAd", page);
};

const clearPreviousBets = async (page) => {
  console.log("Clearing All previous bets");
  // await PageApi.find("sportyPopUps", page);
  // await PageApi.click("sportyPopUps", page);
  await PageApi.find("closeFastbetSlip", page);
  await PageApi.click("closeFastbetSlip", page);
  const betCount = await PageApi.getText("expandCurrentBet", page);
  console.log(betCount);
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
    console.log("isErrorPick",isErrorPick)
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
  if (parseInt(amt.trim(), 10) < 5) {
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
