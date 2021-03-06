const logArchitect = require("./architect");

activeGameLog = {}

let gameLog = [];

activeGameLog.additem = (item /*gameid*/) =>{
    //check if array contains object ,else add object
    if(gameLog.lastIndexOf(item) == -1){
        gameLog.push(item)
    }

    return gameLog;
}

activeGameLog.verifyGame = (item) =>{
    if(gameLog.lastIndexOf(item) == -1){
        //game not betted on
       return true;
    }else{
        return false;
    }
}
  
activeGameLog.showLogs = () =>{
    logArchitect.addConsoleItem({"activegamelog":gameLog});
}

module.exports = activeGameLog;