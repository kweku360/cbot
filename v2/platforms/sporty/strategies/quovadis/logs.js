


const logQuovadis = {};

logQuovadis.processGameLog = async (page) => {
    let gameLog = {}
    //League name
    const leagueName = await page.$eval(
        `.m-main-mid > .m-prematch-detail > div > .m-event-title > .m-event-league`,
        (el) => el.innerHTML
    );
    //Home Team
    const homeTeam = await page.$eval(
        `.m-prematch-detail > div > .m-event-title > .m-event-title-team > .homeTeamName`,
        (el) => el.innerHTML
    );
    //Away Team
    const awayTeam = await page.$eval(
        `.m-prematch-detail > div > .m-event-title > .m-event-title-team > .awayTeamName`,
        (el) => el.innerHTML
    );
    //Event Date
    const eventDate = await page.$eval(
        `div > .m-event-title > .m-event-time-wrap > .m-event-time-left > .event-date`,
        (el) => el.innerHTML
    );
    //Event Time
    const eventTime = await page.$eval(
        `div > .m-event-title > .m-event-time-wrap > .m-event-time-left > .event-time`,
        (el) => el.innerHTML
    );

    //Event ID
    const eventID = await page.$eval(
        `div > .m-event-title > .m-event-time-wrap > .m-event-time-left > .event-gameid`,
        (el) => el.innerHTML
    );

    gameLog = {leagueName,homeTeam,awayTeam,eventDate,eventTime,eventDate}
    console.log(gameLog)
    // save game log to persistence

}
logQuovadis.   


module.exports = logQuovadis;