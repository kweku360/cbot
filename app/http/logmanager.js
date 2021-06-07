var logArchitect = require("../../managers/log/architect");
loggingResource = {};

loggingResource.startLog = (req, res) => {
//   logArchitect.showLogs();
  res.send(logArchitect.showLogs())
}

loggingResource.startConsoleLog = (req, res) => {
  //   logArchitect.showLogs();
    res.send(logArchitect.showConsoleLogs())
  }

module.exports = loggingResource;