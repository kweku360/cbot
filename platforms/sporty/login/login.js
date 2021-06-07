var dotenv = require("dotenv");

dotenv.config();
loginResource = {};

loginResource.login = async (page) => {
    await page.waitForSelector('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
    await page.click('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
    await  page.type('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input',`${process.env.ACCOUNT_NUMBER}`)

    await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
    await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
    await  page.type('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input',`${process.env.ACCOUNT_PASS}`)
    await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn')
    await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn')
    
};

module.exports = loginResource;
