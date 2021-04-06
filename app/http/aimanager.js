/*
* AIManager
* Manages all AI related endpoints
* @kwekukankam - chancebot 2021
*/
var betShoreManager = require("../../ai/betshore")
var arbManager = require("../../ai/thearb")
aiResource = {};
aiResource.betShore = async (req, res) => {
   res.send(betShoreManager.run(req.body))
};

aiResource.theArb = async (req, res) => {
    res.send(arbManager.run(req.body))
}

module.exports = aiResource;