/*
 * MarketPicker
 * Picks a suitable market to bet on.(based on various parameters)
 * @kwekukankam - chancebot 2021
 */
var placeBet = require("./placebet");
MarketPicker = {}
/*
 * Picks a valid bet based on odds provided 
 * Bet amount is specified here 
 * Bet odds is specified here
 */
MarketPicker.pickMarket = async (page) => {
     try {
         //get count of markets
        await page.waitForSelector('.m-detail-wrapper > .m-table__wrapper')
        const marketcount = await page.evaluate(() => {
            const wrapper = Array.from(document.querySelectorAll('.m-detail-wrapper > .m-table__wrapper'))
            return wrapper.length;
        });

        //we do some logging
        console.log("total markets  " + marketcount + "\n")
        logArchitect.addItem({"total markets": marketcount})
    
        //Loop through marketcount 
        for (var i = 1; i < marketcount; i++) {
            let marketCountItem = i; 
            const outcome = await page.evaluate((marketCountItem) => {
                const wrapper = Array.from(document.querySelectorAll(`.m-detail-wrapper > .m-table__wrapper:nth-child(${marketCountItem}) > .m-table:nth-child(2) > .m-outcome > .m-table-cell`))
                return wrapper.length;
            }, marketCountItem);
            //inner loop to get odds value.
            for (var k = 1; k <= outcome; k++) {
                const checkOdds = await page.evaluate((marketCountItem, k) => {
                    const wrapper = document.querySelector(`.m-detail-wrapper > .m-table__wrapper:nth-child(${marketCountItem}) > .m-table:nth-child(2) > .m-outcome > .m-table-cell:nth-child(${k}) > .m-table-cell-item:nth-child(2)`)
                    if (wrapper != null) {
                        let v = parseFloat(wrapper.innerHTML);
                        if (isNaN(v)) {
                            return 0
                        } else {
                            return wrapper.innerHTML;
                        } 
                    } else {
                        return 0;
                    }
                }, marketCountItem, k); 
    
                //we log value of of odd for the various markets
                logArchitect.addItem({"odds value": checkOdds})
                
                //check for odds range and place bet
                if (checkOdds > 1.03 && checkOdds < 1.07) {
    
                    console.log("Found Correct Range value " + checkOdds)
    
                    logArchitect.addItem({"Success": "true"})
                    logArchitect.addItem({"Valid Range Found": checkOdds})
               
                    // let betVal = betUtils.calculateOdds(checkOdds, 0.50) 

                    //place bet is called
                    placeBet.live(page,marketCountItem,k /*offset*/ ,1 /*bet amount*/,checkOdds/*odds value*/); 

                    return;
                }
            }
        }
    
     } catch (error) {
        console.log("Market Picker Error - unable to pick current market")
     }
    
    } 

    module.exports = MarketPicker