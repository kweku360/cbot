var StdResponse = require("./stdresponse");
logArchitect = {}

let cbotlogs = [];
let cbotConsolelogs = [];

logArchitect.setIteration = () =>{
    //adds an iteration to cbotlogs
    if(cbotlogs.length == 0){
        //we have an empty log
        const logItem = {
            "id" : 1, 
            "count": 1,
            "time": Date.now()
        }
        cbotlogs.push(logItem)
    }
    else{
        const logItem = {
            "id" : cbotlogs.length+1,
            "count": cbotlogs.length+1,  
            "time": Date.now()
        }
        cbotlogs.push(logItem) 
    }
}

logArchitect.addItem = (item) =>{
    // console.log(cbotlogs[cbotlogs.length-1])
    cbotlogs[cbotlogs.length-1] = {...cbotlogs[cbotlogs.length-1],...item}
}
logArchitect.showLogs = () =>{
    return StdResponse("true", cbotlogs);
}

logArchitect.setConsoleIteration = () =>{
    console.log("item here");
    //adds an iteration to cbotlogs
    if(cbotConsolelogs.length == 0){
        //we have an empty log
        const logItem = {
            "id" : 1, 
            "time": Date.now()
        }
        cbotConsolelogs.push(logItem)
    }
    else{
        const logItem = {
            "id" : cbotConsolelogs.length+1,
            "time": Date.now()
        }
        cbotConsolelogs.push(logItem) 
    }
}

logArchitect.addConsoleItem = (item) =>{
    // console.log(cbotlogs[cbotlogs.length-1])
    cbotConsolelogs[cbotConsolelogs.length-1] = {...cbotConsolelogs[cbotConsolelogs.length-1],...item}
}
logArchitect.showConsoleLogs = () =>{
    console.log("herer we are")
    return StdResponse("true", cbotConsolelogs);
}

module.exports = logArchitect;