const puppeteer = require('puppeteer');

let page = null; 

async function startBrowser(){
    let browser;
    try {
        console.log("Opening the browser......");
        logArchitect.addConsoleItem({"msg":"Opening Browser -----"});
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }

    return browser;
}

function setCurrentPage(currpage){
   page = currpage;
}

function getCurrentPage(){
    if(page != null){
        return page;
    }
    logArchitect.addConsoleItem({"msg":"No page object has been set"});
 }

module.exports = {
    startBrowser,setCurrentPage,getCurrentPage
};