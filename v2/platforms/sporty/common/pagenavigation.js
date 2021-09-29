/*
 * PageNavigation
 * Handle various page navigations through mouse clicks here
 * @kwekukankam - chancebot 2021
 */
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

module.exports = pageNavigate;
