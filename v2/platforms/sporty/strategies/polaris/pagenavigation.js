/*
 * PageNavigation
 * Handle various page navigations through mouse clicks here
 * @kwekukankam - cbot 2023
 */
var State = require("../../../../state");
var pageNavigate = {};

/*
 * click on live betting link
 */
pageNavigate.toLiveBet = async (page) => {
  try {
    await page.waitForSelector(
      ".m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span"
    );
    await page.click(
      ".m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span"
    );
  } catch (e) {
    // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
  }
};
/*
 * click on vfootball link
 */
pageNavigate.toVFootball = async (page) => {
  try {
    await page.waitForSelector('div > .m-overview > .sport-name > .sport-name-item:nth-child(2) > .text')
    await page.click('div > .m-overview > .sport-name > .sport-name-item:nth-child(2) > .text')
  } catch (e) {
    // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
  }
};
/*
 * click on multiple betting link
 */
pageNavigate.toMultipleBet = async (page) => {
  try {
    const navigationPromise = page.waitForNavigation();
    await navigationPromise;
    await page.waitForSelector(
      ".m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)"
    );
    await page.click(
      ".m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)"
    );
  } catch (e) {
    // logArchitect.addConsoleItem({"msg":"Multiple bet Click Error","error":e.toString()});
  }
};
pageNavigate.toActiveGame = async (page) => {
  try {
    //get active game
    const activeGame = State.activeGame.find(x => x.active === true);
    console.log(State.activeGame)
    if (activeGame) {
      console.log("hello")
      await page.waitForSelector(`.m-table-row:nth-child(${activeGame.meta.position[1] + 1}) > .m-table-cell > .left-team-table > .teams > .home-team`)
      await page.click(`.m-table-row:nth-child(${activeGame.meta.position[1] + 1}) > .m-table-cell > .left-team-table > .teams > .home-team`)
      //move active to the next position
    }
  } catch (e) {
    console.log(e.toString());
    // logArchitect.addConsoleItem({"msg":"Multiple bet Click Error","error":e.toString()});
  }
};

pageNavigate.toTodaysFootball = async (page) => {
  try {
    const navigationPromise = page.waitForNavigation();
    await page.waitForSelector('.m-nav > .m-header-item > #header > .m-flex-item:nth-child(2) > span')
    await page.click('.m-nav > .m-header-item > #header > .m-flex-item:nth-child(2) > span')

    await page.waitForSelector('.m-table-cell > div > #sportList > .titles > .sportList-title')
    await page.click('.m-table-cell > div > #sportList > .titles > .sportList-title')
  } catch (e) {
    console.log(e.toString())
    // logArchitect.addConsoleItem({"msg":"Multiple bet Click Error","error":e.toString()});
  }
};

module.exports = pageNavigate;
