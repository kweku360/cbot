const PageApi = require("../../facade/pageapi");
const { getCurrentTimeStamp } = require("../../utils/date");

const buildGameInfo = async (page, currentleague, currentgame) => {
  let gameInfo = {};
  const homeTeam = await PageApi.getText("homeTeam", page, {
    replacementArr: [currentleague, currentgame],
  });

  const awayTeam = await PageApi.getText("awayTeam", page, {
    replacementArr: [currentleague, currentgame],
  });

  const homeScore = await PageApi.getText("homeScore", page, {
    replacementArr: [currentleague, currentgame],
  });

  const awayScore = await PageApi.getText("awayScore", page, {
    replacementArr: [currentleague, currentgame],
  });

  const leagueName = await PageApi.getText("leagueName", page, {
    replacementArr: [currentleague],
  });

  const gameTime = await PageApi.getText("gameTime", page, {
    replacementArr: [currentleague, currentgame],
  });

  const gameHalf = await PageApi.getText("gameHalf", page, {
    replacementArr: [currentleague, currentgame],
  });

  gameInfo = {
    leagueName,
    id: (homeTeam + "_" + awayTeam).replace(/\s+/g, ""),
    hometeam: homeTeam.trim(),
    awayteam: awayTeam.trim(),
    currentscore: { home: homeScore.trim(), away: awayScore.trim() },
    gameTime: parseInt(gameTime.trim().split(":")[0].trim()),
    gameHalf,
    timestamp: Date.now(),
    position: [currentleague, currentgame],
    prisonCount: 0,
  };

  return gameInfo;
};
const buildGameInfoPreMatch = async (page, currentleague, currentgame) => {
  try {
    let gameInfo = {};
    const homeTeam = await PageApi.getText("hTeam", page, {
      replacementArr: [currentleague, currentgame],
    });

    const awayTeam = await PageApi.getText("aTeam", page, {
      replacementArr: [currentleague, currentgame],
    });

    const leagueName = await PageApi.getText("lName", page, {
      replacementArr: [currentleague],
    });

    gameInfo = {
      leagueName,
      id: (homeTeam + "_" + awayTeam).replace(/\s+/g, ""),
      hometeam: homeTeam.trim(),
      awayteam: awayTeam.trim(),
      timestamp: Date.now(),
      position: [currentleague, currentgame],
      prisonCount: 0,
    };

    return gameInfo;
  } catch (e) {
    return {id:"NoItem"};
  }
};
module.exports = { buildGameInfo, buildGameInfoPreMatch };
