var {
  startBrowser,
  delay,
  checkInstance,
  closeInstance,
  getPuppeteerInstance,
  getPageInstance,
} = require("./browser");
const puppeteer = require("puppeteer");
const pm2 = require('pm2');

const { spawn } = require("child_process");
var consoleManager = {};

consoleManager.browserStatus = async (req, res) => {
  if (checkInstance()) {
    res.json({ status: true, msg: "browser is running" });
  } else {
    res.json({ status: false, msg: "browser is disconnected" });
  }
};
consoleManager.browserStop = async (req, res) => {
  res.json({ status: true, msg: "browser stopped" });
  await delay(4000);
  process.exit();
  // closeInstance();
};

consoleManager.pm2StartProcess = (req,res) => {
  pm2.connect(true, err => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    pm2.start(`ecosystem.config.js`,{
      name: req.query.name
  }, (err, apps) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.disconnect();
    });
  });
  res.json({ status: true, msg: "Process Started" });
};
consoleManager.pm2StopProcess = (req,res) => {
  pm2.connect(true, err => {
    if (err) {
      res.json({ status: false, msg: "Unable to Connect to Pm2 peocess" + err.toString()  });
      process.exit(2);
    }

    pm2.stop(req.query.name, function(err, proc) {
      if (err) {
          console.error(err);
      } else {
          console.log('Process "sporty_0207598163 " stopped.');
          res.json({ status: true, msg: "Process Stoped" });
      }
      pm2.disconnect();
  });

  });
  
};
consoleManager.pm2RestartProcess = (req,res) => {
  pm2.connect(true, err => {
    if (err) {
      res.json({ status: false, msg: "Unable to Connect to Pm2 peocess" + err.toString()  });
      process.exit(2);
    }
    pm2.restart(req.query.name, function(err, proc) {
      if (err) {
          console.error(err);
      } else {
          res.json({ status: true, msg: "Process "+ req.query.name +  " restarted." });
      }
      pm2.disconnect();
  });

  });
  
};
module.exports = consoleManager;
