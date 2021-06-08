singleMarket = {};

singleMarket.predict = async (page) => {

    await page.waitForSelector('.m-detail-wrapper > .m-table__wrapper')
    const marketcount = await page.evaluate(() => {
        const wrapper = Array.from(document.querySelectorAll('.m-detail-wrapper > .m-table__wrapper'))
        return wrapper.length;
    });
    console.log("total markets  " + marketcount + "\n")

    page.exposeFunction('puppeteerMutationListener', puppeteerMutationListener);

    await page.evaluate(() => {
        const target = document.querySelector('.m-table-cell-item');
        console.log(target);
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            window.puppeteerMutationListener(
              mutation.removedNodes[0].textContent,
              mutation.addedNodes[0].textContent,
            );
          }
        });
        observer.observe(
          target,
          { childList: true },
        );
      });
}

function puppeteerMutationListener(oldValue, newValue) {
    console.log("winner")
    console.log(`${oldValue} -> ${newValue}`);
  }

module.exports = singleMarket;   