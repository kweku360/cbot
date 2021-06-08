betUtils = {};

betUtils.calculateOdds = (odd,profitamt)=>{
    let fixedval = (odd * 50) - 50;
    let betval = (50 * profitamt) / fixedval;
    betval = Math.ceil( betval ); 
    return betval;
}
betUtils.waitForSelector = (selector)=>{
    let fixedval = (odd * 50) - 50;
    let betval = (50 * profitamt) / fixedval;
    betval = Math.ceil( betval ); 
    return betval;
}
module.exports = betUtils;