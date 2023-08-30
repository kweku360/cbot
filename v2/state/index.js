

const State = {}
//activegame Scheme
/*
 * {
        id : "",unique joins h-team and away team
        name : //name picked ui,
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
 */
State.activeGame = [];
State.bets = []

State.setState = (state,value)=>{
    State[state] = value;
}
State.getState = (state)=>{
    return State[state];
}

module.exports = State;

/*
 * Bet Schemes
 * {
        id : "",//shd be the game id if we get it
        name : //unique joins h-team and away team,
        market : "",
        oddPick : "",
        time : "",
        gameInfo : {},
        stakeAmt : ,
        returnAmt:,
        result : , won | lost | pending
        betStatus : "", running | game ended
        dateCreated
   }
 */