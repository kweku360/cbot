loginResource = {};

loginResource.login = async (page) => {
    await page.waitForSelector('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
    await page.click('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
    await  page.type('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input',"0543499645")

    await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
    await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
    await  page.type('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input',"angusd3i")
    await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn')
    await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn')
    
};

module.exports = loginResource;


// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
  
//   await page.goto('https://www.sportybet.com/gh/')
  
//   await page.setViewport({ width: 1920, height: 652 })
  
//   await page.waitForSelector('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
//   await page.click('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
  
//   await page.waitForSelector('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
//   await page.click('.m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input')
  
//   await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
//   await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
  
//   await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
//   await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
  
//   await page.waitForSelector('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
//   await page.click('.m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input')
  
//   await browser.close()
// })()