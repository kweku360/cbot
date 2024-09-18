const SelectorApi = require("./selectorapi");

PageApi = {};

PageApi.find = async (selector, page, options = {}) => {
  const { timeout = 5000 } = options;
  let value = SelectorApi.getSelectorByName(selector);
  if (options.replacementArr) {
    value = SelectorApi.getSelectorWithVariables(
      selector,
      options.replacementArr  
    );
  }
  try {
    await page.waitForSelector(value, {
      timeout,
    });
  } catch (error) { 
    // console.error(`Error waiting for selector "${selector}":`, error);
   // console.log(`TimeOut waiting for selector "${selector}":`);
  }
};

PageApi.click = async (selector, page, options = {}) => {
  const { timeout = 5000 } = options;
  let value = SelectorApi.getSelectorByName(selector);
  if (options.replacementArr) {
    value = SelectorApi.getSelectorWithVariables(
      selector,
      options.replacementArr
    );
  }
  try {
    await page.click(value, {timeout,});
  } catch (error) {
  //  console.log(`Timeout clicking on "${selector}":`);
    // console.error(`Timeout clicking on "${selector}":`, error);
  }
};

PageApi.findArrayCount = async (selector, page, options = {}) => {
  const { timeout = 5000 } = options;
  let value = SelectorApi.getSelectorByName(selector);
  if (options.replacementArr) {
    value = SelectorApi.getSelectorWithVariables(
      selector,
      options.replacementArr
    );
  }
  try {
    const count = await page.evaluate((val) => {
      const wrapper = Array.from(document.querySelectorAll(val));
      return wrapper.length;
    }, value);
    return count;
  } catch (error) {
      // console.log(`Unable to get count for "${selector}":`,error);
    // console.error(`Error waiting for selector "${selector}":`, error);
  }
};

PageApi.getText = async (selector, page, options = {}) => {
  const { timeout = 5000 } = options;
  let value = SelectorApi.getSelectorByName(selector);
  if (options.replacementArr) {
    value = SelectorApi.getSelectorWithVariables(
      selector,
      options.replacementArr
    );
  }
  try {
    const val = await page.$eval(value,(el) => el.innerHTML);
    return val;
  } catch (error) {
    // console.error(`Error waiting for selector "${selector}":`, error);
  //  console.log(`TimeOut Getting text for "${selector}":`);
  }
};

PageApi.delay = (time) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
module.exports = PageApi;
