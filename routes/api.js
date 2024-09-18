var express = require("express");
var router = express.Router();
const account = require("../app/../managers/account/accountmanager");
const livebetting = require("../app/http/betmanager");
const loggingResource = require("../app/http/logmanager");
const aiResource = require("../app/http/aimanager");
const sportyManager = require("../v2/platforms/sporty/manager");
const aviatorManager = require("../v2/platforms/sporty/aviator/manager");

/* Test Browser */
// router.get("/", login.tester);

/* Account Routes . */
router.get("/account/balance", account.accountBalance);

/* live betting Routes . */
router.get("/live/processstart", livebetting.startBetting);

/* logging Routes . */
router.get("/live/logs", loggingResource.startLog);
router.get("/live/console/logs", loggingResource.startConsoleLog);

/* Betshore Routes . */
router.post("/live/betshore", aiResource.betShore);
router.post("/live/betarb", aiResource.theArb);
router.post("/live/revbetshore", aiResource.revBetShore);

// ChanceBot v2 routes {/v2/{strategy}/action}
router.get("/v2/betshore/all", sportyManager.betShoreAll);
router.get("/v2/polaris/start", sportyManager.polaris);
router.get("/v2/benhur/start", sportyManager.benhur);
router.get("/v2/benhur/logs", loggingResource.benHurLogs);
// vfootball 
router.get("/v2/arsenal/start", sportyManager.arsenal);
//scheduled soccer betting  (QuoVadis)
router.get("/v2/quovadis/start", sportyManager.quoVadis);

// the aviator
router.get("/v2/aviator/start", aviatorManager.aviate);
module.exports = router;
