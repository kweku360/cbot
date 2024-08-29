/*
 * PageNavigation - Quovadis
 * Handle various page mouse clicks here
 * @kwekukankam - cbot
 */

var pageNavigate = {};

/*
 * click on todays fixtures
 */
pageNavigate.toTodaysGames = async (page) => {
    try {
        await page.waitForSelector('.top-main > .popular > .popular-list > .top-link:nth-child(1) > .top-link-item')
        await page.click('.top-main > .popular > .popular-list > .top-link:nth-child(1) > .top-link-item')
    } catch (e) {
        // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
    }
};
pageNavigate.hourInterval = async (page) => {
    try {
        await page.waitForSelector('.m-slider-wrapper > .m-slider > .m-slider-piecewise > .m-slider-piecewise-item:nth-child(1) > .m-slider-piecewise-label')
        await page.click('.m-slider-wrapper > .m-slider > .m-slider-piecewise > .m-slider-piecewise-item:nth-child(1) > .m-slider-piecewise-label')
    } catch (e) {
        // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
    }
};
/*
 * click on to 3 Hour interval for mobile screens
 */
pageNavigate.toThreeHourInterval = async (page) => {
    try {
        await page.waitForSelector('.m-snap-nav-wrap > .m-snap-nav > .m-popular-item:nth-child(3) > a > img')
        await page.click('.m-snap-nav-wrap > .m-snap-nav > .m-popular-item:nth-child(3) > a > img')
    } catch (e) {
        // logArchitect.addConsoleItem({"msg":"Live bet Click Error","error":e.toString()});
    }
};
module.exports = pageNavigate;
