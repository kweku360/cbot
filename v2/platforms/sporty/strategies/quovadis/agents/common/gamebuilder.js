const PageApi = require("../../facade/pageapi");
const { getCurrentTimeStamp } = require("../../utils/date")

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
module.exports = buildGameInfo;
