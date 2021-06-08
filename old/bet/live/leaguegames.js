leagueGames = {}

leagueGames.runner = async (page) => {

    const navigationPromise = page.waitForNavigation();
    await navigationPromise;

    await page.waitForSelector('.m-overview > .match > .m-table')
    const data = await page.evaluate(() => {
        const wrapper = Array.from(document.querySelectorAll('.m-overview > .match > .m-table'))
        return wrapper.length;
    });
    //get random pick
    const currentPick = getRandomNum(data - 1, 2);

    //get length of inner games
    const leagueGameCount = await page.evaluate((randomPick) => {
        const wrapper = Array.from(document.querySelectorAll(`.m-overview > .match > .m-table:nth-child(${randomPick}) > .m-table-row`))
        return wrapper.length;
    }, currentPick);

    const leagueGamePick = getRandomNum(leagueGameCount - 1, 2);

    console.log(leagueGamePick)
    console.log(currentPick)

    //now click on market size
    await page.waitForSelector(`.m-overview > .match > .m-table:nth-child(${currentPick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)
    await page.click(`.m-overview > .match > .m-table:nth-child(${currentPick}) > .m-table-row:nth-child(${leagueGamePick}) > .market-size`)

}

function getRandomNum(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = leagueGames