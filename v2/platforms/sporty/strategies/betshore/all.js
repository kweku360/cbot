var pageNavigate = require("../../common/pagenavigation");

var BetShoreAll = {};

const betArr = [];
BetShoreAll.architect = async (page) => {
  pageNavigate.toLiveBet(page);
  pageNavigate.toMultipleBet(page);
};

module.exports = BetShoreAll;
