

const State = {}
//activegame Scheme
/*
 * {
        id : "",
        name : //unique joins h-team and away team,
        hometeam : "",
        awayteam : "",
        league : "",
        currentscore : {home:"",away:""},
        currenttime : "",
        currenthalf : "",
        meta : {
            visitedcount : "",
            position : "", //this is the gamelist position
            islocked : "", //boolean - if is locked on loop
        }
   }
 * @kwekukankam - chancebot 2021
 */
State.activeGame = [];

State.setState = (state,value)=>{
    State[state] = value;
}
State.getState = (state)=>{
    return State[state];
}

module.exports = State;