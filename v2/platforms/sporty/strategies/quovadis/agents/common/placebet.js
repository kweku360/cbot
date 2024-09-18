
var State = require("../index");
const PageApi = require("../../facade/pageapi");
const QuovadisDb = require("../../db/index");
const { generateUniqueId } = require("../../utils/uuid");

const placeBet = async (page, pickedGame) => {
    //close unnnecesary popups
    await PageApi.delay(1000);
    await PageApi.find("sportyPopUps", page);
    await PageApi.click("sportyPopUps", page);
    await PageApi.delay(1000);
  
    await PageApi.find("closeFastbetSlip", page);
    await PageApi.click("closeFastbetSlip", page); 
  
    await PageApi.delay(1000);
    await PageApi.find("expandCurrentBet", page);
    await PageApi.click("expandCurrentBet", page);
    await PageApi.delay(1000);
    await PageApi.find("openVirtualKeyboard", page);
    await PageApi.click("openVirtualKeyboard", page);
    await PageApi.delay(1000);
    await PageApi.find("clearDefaultBetvalue", page);
    await PageApi.click("clearDefaultBetvalue", page);
  
    let amount = 5 + "";
    if (amount[amount.length - 1] === "0" && amount.includes(".")) {
      let str = amount.split("");
      str[amount.length - 1] = "1";
      amount = str.join("");
    }
  
    for (let ch of amount) {
      ch = ch == "." ? "d" : parseInt(ch, 10);
      await PageApi.delay(500);
      if (ch !== 0 && ch <= 6) {
        await PageApi.find("keyboardTopValuePress", page, {
          replacementArr: [ch],
        });
        await PageApi.click("keyboardTopValuePress", page, {
          replacementArr: [ch],
        });
      }
      if (ch === 0 || ch > 6 || ch === "d") {
        //mappin
        const kMaps = { 7: "1", 8: "2", 9: "3", 0: "4", d: "5" };
  
        await PageApi.find("keyboardDownValuePress", page, {
          replacementArr: [kMaps[ch]],
        });
        await PageApi.click("keyboardDownValuePress", page, {
          replacementArr: [kMaps[ch]],
        });
      }
    }
    //click done
    await PageApi.delay(1000);
    await PageApi.find("acceptChanges", page);
    await PageApi.click("acceptChanges", page);
    await PageApi.delay(1000);
    await PageApi.find("confirmBet", page);
    await PageApi.click("confirmBet", page);
    await PageApi.delay(1000);
    await PageApi.find("placeBet", page);
    await PageApi.click("placeBet", page);
  
    await PageApi.delay(1000);
    await PageApi.find("finishBet", page);
    await PageApi.click("finishBet", page);
  
    const doc = {
        _id : generateUniqueId(pickedGame["id"]),
        data:pickedGame
      }
      await QuovadisDb.saveDocument(doc);
      State.setState("pickedGame", []);
  };

  module.exports = placeBet;