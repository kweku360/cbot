var logArchitect = require("../../managers/log/architect");
loggingResource = {};

loggingResource.startLog = (req, res) => {
//   logArchitect.showLogs();
  res.send(logArchitect.showLogs())
}

module.exports = loggingResource;