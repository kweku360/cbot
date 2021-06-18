var dotenv = require("dotenv");

dotenv.config();
loginResource = {};

loginResource.login = async (page) => {

    await page.waitForSelector('.navbar-form #MobileNumber')
    await page.click('.navbar-form #MobileNumber')
    await  page.type('.navbar-form #MobileNumber',`${process.env.ACCOUNT_NUMBER}`)

    await page.waitForSelector('.form-inline > #inlineLoginPasswordInput #Password')
    await page.click('.form-inline > #inlineLoginPasswordInput #Password')
    await  page.type('.form-inline > #inlineLoginPasswordInput #Password',`${process.env.ACCOUNT_PASS}`)
    
    await page.waitForSelector('form > #partialLogin #Login')
    await page.click('form > #partialLogin #Login')
    
};

module.exports = loginResource;
