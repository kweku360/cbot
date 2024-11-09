var PageApi = require("../aviator/facade/pageapi");
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
    `0207598163`
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
  await page.waitForSelector(
    ".header-nav > .header-nav-right > .flex-wrapper > .no-login > span:nth-child(2)"
  );
  await page.click(
    ".header-nav > .header-nav-right > .flex-wrapper > .no-login > span:nth-child(2)"
  );

  await page.waitForSelector(
    "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap"
  );
  await page.click(
    "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap"
  );
  await page.type(
    "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap",
    `${process.env.SPORTYACC}`
  );

  await page.waitForSelector(
    "#loginStep > .login-container > form  > .verifyInputs > .m-input-wap__password"
  );
  await page.click(
    "#loginStep > .login-container > form > .verifyInputs > .m-input-wap__password"
  );
  await page.type(
    "#loginStep > .login-container > form > .verifyInputs > .m-input-wap__password",
    `${process.env.SPORTYPASS}`
  );

  await page.waitForSelector(
    ".register-and-login > #loginStep > .login-container > form > .af-button"
  );
  await page.click(
    ".register-and-login > #loginStep > .login-container > form > .af-button"
  );
};

loginManager.loginMobile = async (page) => {
  try {
    //const recorder = await page.screencast({path: 'recording.webm'});
    // await page.waitForSelector(".m-region-list > .active")
    // await page.click(".m-region-list > .active")

    await page.waitForSelector(
      ".mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login"
    );
    await page.click(
      ".mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login"
    );

    await page.waitForSelector(
      ".mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login"
    );
    await page.click(
      ".mobile-navbar > .navbar-wraper > .mobile-navbar-right > .m-login-not > .m-btn-login"
    );

    await page.waitForSelector(
      "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap"
    );
    await page.click(
      "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap"
    );
    await page.type(
      "#loginStep > .login-container > form > .m-input-wap-group > .m-input-wap",
      `${process.env.SPORTYACC}`
    );

    await page.waitForSelector("input[type=password]");
    await page.click("input[type=password]");
    await page.type("input[type=password]", `${process.env.SPORTYPASS}`);

    await page.waitForSelector(
      ".register-and-login > #loginStep > .login-container > form > .af-button"
    );
    await page.click(
      ".register-and-login > #loginStep > .login-container > form > .af-button"
    );
    //await recorder.stop();
  } catch (error) {
    console.error("login Error", error);
  }
};

loginManager.loginBetway = async (page) => {
  try {
    await delay(3000);
    await page.waitForSelector("#close-toast");
    await page.click("#close-toast");
    // await delay(2000);
    // await page.waitForSelector('.w-full > .container > .flex > .flex > .p-button:nth-child(2)')
    // await page.click('.w-full > .container > .flex > .flex > .p-button:nth-child(2)')
    await delay(2000);
    await page.waitForSelector(
      ".flex:nth-child(2) > .flex:nth-child(1) > .p-button:nth-child(2) > .flex > span"
    );
    await page.click(
      ".flex:nth-child(2) > .flex:nth-child(1) > .p-button:nth-child(2) > .flex > span"
    );
    await delay(2000);
    await page.waitForSelector("#login-mobile");
    await page.click("#login-mobile");
    await page.type("#login-mobile", `0543499645`);
    await delay(2000);
    await page.waitForSelector("#login-password");
    await page.click("#login-password");
    await page.type("#login-password", `Swampus3`);
    await delay(2000);
    await page.waitForSelector('form > .w-full > .p-button > .flex > span')
    await page.click('form > .w-full > .p-button > .flex > span')
  } catch (error) {
    console.error("login Error", error);
  }
};

loginManager.loginParimatch = async (page) => {
  try {
    await delay(1000);
    await PageApi.find("toLogin", page);
    await PageApi.click("toLogin", page);
    await delay(1000);
    await page.waitForSelector('#login-form-phone')
    await page.click('#login-form-phone')
    await page.type('#login-form-phone',`207598163`)
    await delay(1000);

    await page.waitForSelector('#login-form-password')
    await page.click('#login-form-password')
    await page.type('#login-form-password',`Swampus3`)
    await delay(2000);
    await page.waitForSelector('#log-in-button')
    await page.click('#log-in-button')

  } catch (error) {
    console.error("login Error", error);
  }
};

loginManager.loginBet22 = async (page) => {
  try {
    await delay(1000);
    await PageApi.find("toLogin", page);
    await PageApi.click("toLogin", page);
    await delay(1000);
    await page.waitForSelector('#login-form-phone')
    await page.click('#login-form-phone')
    await page.type('#login-form-phone',`207598163`)
    await delay(1000);

    await page.waitForSelector('#login-form-password')
    await page.click('#login-form-password')
    await page.type('#login-form-password',`Swampus3`)
    await delay(2000);
    await page.waitForSelector('#log-in-button')
    await page.click('#log-in-button')

  } catch (error) {
    console.error("login Error", error);
  }
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = loginManager;
// ${process.env.ACCOUNT_PASS}
// ${process.env.ACCOUNT_NUMBER
