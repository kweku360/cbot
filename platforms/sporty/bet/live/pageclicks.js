/*
 * PageClicks
 * Handle various mouse clicks here
 * @kwekukankam - chancebot 2021
 */
pageClicks = {}

/*
 * click on live betting link
 */
pageClicks.clickLiveBet = async (page) => {
    try{
        await page.waitForSelector('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
        await page.click('.m-nav-wrapper > .m-nav-main > #topHeader > #header_nav_liveBetting > span')
    }catch(e){
        console.log("unable to click live bet");
        //await page.reload();
    }
};
/*
 * click on multiple betting link
 */
pageClicks.clickMultipleBet = async (page) => {
    try{
        const navigationPromise = page.waitForNavigation();
        await navigationPromise
        await page.waitForSelector('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
        await page.click('.m-nav-bar > .m-nav > .m-header-item > #header > .m-flex-item:nth-child(1)')
    }catch(e){
        console.log("unable to click multiple bet");
    }

};

module.exports = pageClicks;