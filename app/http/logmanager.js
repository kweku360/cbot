var logArchitect = require("../../managers/log/architect");
var State = require("../../v2/state");
loggingResource = {};

loggingResource.startLog = (req, res) => {
  //   logArchitect.showLogs();
  res.send(logArchitect.showLogs());
};

loggingResource.benHurLogs = (req, res) => {
  //   logArchitect.showLogs();
  res.send(State.getState("bets"));
};
loggingResource.startConsoleLog = (req, res) => {
  //   logArchitect.showLogs();
  res.send(logArchitect.showConsoleLogs());
};

module.exports = loggingResource;
