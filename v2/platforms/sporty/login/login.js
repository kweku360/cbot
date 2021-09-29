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

module.exports = loginManager;
// ${process.env.ACCOUNT_PASS}
// ${process.env.ACCOUNT_NUMBER
