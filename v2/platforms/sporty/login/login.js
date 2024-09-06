var dotenv = require("dotenv");

dotenv.config();
var loginManager = {};

loginManager.login = async (page) => {
  await page.waitForSelector(
    ".m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input"
  );
  await page.click(
    ".m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input"
  );
  await page.type(
    ".m-login-bar > .m-opt > .m-phone-wrapper > .m-phone > input",
    `0543499645`
  );

  await page.waitForSelector(
    ".m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input"
  );
  await page.click(".m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input");
  await page.type(
    ".m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > input",
    `angusd3i`
  );
  await page.waitForSelector(
    ".m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn"
  );
  await page.click(".m-login-bar > .m-opt > .m-psd-wrapper > .m-psd > .m-btn");
};
loginManager.instantVirtualLogin = async (page) => {
  await page.waitForSelector('.header-nav > .header-nav-right > .flex-wrapper > .no-login > span:nth-child(2)')
  await page.click('.header-nav > .header-nav-right > .flex-wrapper > .no-login > span:nth-child(2)')

  await page.waitForSelector('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap')
  await page.click('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap')
  await page.type('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap', `${process.env.SPORTYACC}`)


  await page.waitForSelector('#loginStep > .login-container > form  > .verifyInputs > .m-input-wap__password')
  await page.click('#loginStep > .login-container > form > .verifyInputs > .m-input-wap__password')
  await page.type('#loginStep > .login-container > form > .verifyInputs > .m-input-wap__password', `${process.env.SPORTYPASS}`)

  await page.waitForSelector('.register-and-login > #loginStep > .login-container > form > .af-button')
  await page.click('.register-and-login > #loginStep > .login-container > form > .af-button')
}; 

loginManager.loginMobile = async (page) => {
  try {
    await page.waitForSelector('.mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login')
    await page.click('.mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login')
  
    await page.waitForSelector('.mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login')
    await page.click('.mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login')
  
  
    await page.waitForSelector('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap')
    await page.click('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap')
    await page.type('#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap', `${process.env.SPORTYACC}`)
   
    await page.waitForSelector('input[type=password]')
    await page.click('input[type=password]')
    await page.type('input[type=password]', `${process.env.SPORTYPASS}`)
  
    await page.waitForSelector('.register-and-login > #loginStep > .login-container > form > .af-button')
    await page.click('.register-and-login > #loginStep > .login-container > form > .af-button') 
  console.log("bro we logg in ooo")
   } catch (error) {
    console.log("Login.login mobile Error - already logged in")
  }

}

module.exports = loginManager;
// ${process.env.ACCOUNT_PASS}
// ${process.env.ACCOUNT_NUMBER
