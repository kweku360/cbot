var PageApi = require("../aviator/facade/pageapi");
var {
  envBuilder,
  delay
} = require("../../../config/browser");
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

loginManager.loginMobile = async (req,page) => {
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
      `${envBuilder(req.headers['x-port'],"ACC")}`
    );

    await page.waitForSelector("input[type=password]");
    await page.click("input[type=password]");
    await page.type("input[type=password]", `${envBuilder(req.headers['x-port'],"PASS")}`);

    await page.waitForSelector(
      ".register-and-login > #loginStep > .login-container > form > .af-button"
    );
    await page.click(
      ".register-and-login > #loginStep > .login-container > form > .af-button"
    );

  } catch (error) {
    console.error("Login Error:");
  }
};

const handlePopups = async (page) => {
  try {
    // Handle guide button popup
    await page.waitForSelector('[data-op*="close_guide_button"]', { timeout: 3000 })
      .then(async () => {
        await page.click('[data-op*="close_guide_button"]');
      })
      .catch(() => {
        console.log("No guide popup found");
      });

    // Handle bet slip popup 
    await page.waitForSelector('.m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon', { timeout: 3000 })
      .then(async () => {
        await page.click('.m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon');
      })
      .catch(() => {
        console.log("No betslip popup found");
      });

    // Handle dialog popup
    await page.waitForSelector('.es-dialog-body > .es-dialog-main > .m-dialog-wrapper > .m-pop-header > .m-icon-close', { timeout: 3000 })
      .then(async () => {
        await page.click('.es-dialog-body > .es-dialog-main > .m-dialog-wrapper > .m-pop-header > .m-icon-close');
      })
      .catch(() => {
        console.log("No dialog popup found");
      });

    // Clear popup background if any
    await page.waitForSelector('.m-betslip-header > .head-container > .wrapper > .wrapper-item > .icon-font-base', { timeout: 3000 })
      .then(async () => {
        await page.click('.m-betslip-header > .head-container > .wrapper > .wrapper-item > .icon-font-base');
      })
      .catch(() => {
        console.log("No popup background found");
      });
  } catch (error) {
    console.log("Error handling popups:", error);
  }
};

loginManager.loginBetway = async (req,page) => {
  try {
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
    await page.type("#login-mobile", `${envBuilder(req.headers['x-port'],"ACC")}`);
    await delay(2000);
    await page.waitForSelector("#login-password");
    await page.click("#login-password");
    await page.type("#login-password", `${envBuilder(req.headers['x-port'],"PASS")}`);
    await delay(2000);
    await page.waitForSelector('form > .w-full > .p-button > .flex > span')
    await page.click('form > .w-full > .p-button > .flex > span')
  } catch (error) {
    console.error("login Error", error);
  }
};

loginManager.loginParimatch = async (req,page) => {
  try {
    await delay(1000);
    await PageApi.find("toLogin", page);
    await PageApi.click("toLogin", page);
    await delay(1000);
    await page.waitForSelector('#login-form-phone')
    await page.click('#login-form-phone')
    await page.type('#login-form-phone',`${envBuilder(req.headers['x-port'],"ACC")}`)
    await delay(1000);

    await page.waitForSelector('#login-form-password')
    await page.click('#login-form-password')
    await page.type('#login-form-password',`${envBuilder(req.headers['x-port'],"PASS")}`)
    // await page.type('#login-form-password',`Swampus3`)
    await delay(2000);
    await page.waitForSelector('#log-in-button')
    await page.click('#log-in-button')

  } catch (error) {
    console.error("login Error", error);
  }
};

loginManager.loginBet22 = async (req,page) => {
  try {
    await delay(1000);
    await PageApi.find("toLogin", page);
    await PageApi.click("toLogin", page);
    await delay(1000);
    await page.waitForSelector('#login-form-phone')
    await page.click('#login-form-phone')
    await page.type('#login-form-phone',`${envBuilder(req.headers['x-port'],"ACC")}`)
    await delay(1000);

    await page.waitForSelector('#login-form-password')
    await page.click('#login-form-password')
    await page.type('#login-form-password',`${envBuilder(req.headers['x-port'],"PASS")}`)
    await delay(2000);
    await page.waitForSelector('#log-in-button')
    await page.click('#log-in-button')

  } catch (error) {
    console.error("login Error", error);
  }
};

// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }

module.exports = loginManager;
// ${process.env.ACCOUNT_PASS}
// ${process.env.ACCOUNT_NUMBER
