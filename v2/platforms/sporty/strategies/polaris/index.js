var pageNavigate = require("./pagenavigation");
var Process = require("./process");

var Polaris = {};

const betArr = [];
Polaris.architect = async (page) => {
  pageNavigate.toLiveBet(page);
  pageNavigate.toMultipleBet(page);
  Process.pickGame(page)
};

module.exports = Polaris;