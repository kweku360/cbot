var StdResponse = require("../log/stdresponse");
logArchitect = {}

let cbotlogs = [];

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

module.exports = logArchitect;