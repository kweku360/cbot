SelectorApi = {};

const selectors = [
  {
    name: "closeSportyAd",
    id: "s-01",
    selector:
      ".m-act-pop > .es-dialog-body > .es-dialog-main > .m-act-wrapper > .m-icon-close",
  },
  {
    name: "allLiveGames",
    id: "s-02",
    selector: ".m-bet-tab > div > .m-bet-content > .view-all > a",
  },
  {
    name: "liveLeagueCount",
    id: "s-03",
    selector: ".m-bet-content > .m-league",
  },
  {
    name: "liveLeagueCount",
    id: "s-03",
    selector: ".m-bet-content > .m-league",
  },
  {
    name: "liveLeagueGameCount",
    id: "s-04",
    selector:
      ".m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live",
  },
  {
    name: "pickedGame",
    id: "s-05",
    selector:
      ".m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .m-info-cell",
  },
  {
    name: "homeTeam",
    id: "s-06",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .m-info-cell > .team`,
  },
  {
    name: "awayTeam",
    id: "s-07",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .m-info-cell > .team:nth-child(2)`,
  },
  {
    name: "awayTeam",
    id: "s-07",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .m-info-cell > .team`,
  },
  {
    name: "homeScore",
    id: "s-08",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .score > .set-score`,
  },
  {
    name: "awayScore",
    id: "s-09",
    selector:  `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-table-row > .score > .set-score:nth-child(2)`,
  },
  {
    name: "leagueName",
    id: "s-10",
    selector:  `.m-bet-content > .m-league:nth-child(une-1) > .m-league-title > .text`,
  },
  {
    name: "gameTime",
    id: "s-11",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-event-meta > .m-event-time`,
  },
  {
    name: "gameHalf",
    id: "s-12",
    selector: `.m-bet-content > .m-league:nth-child(une-1) > .m-league-conent > .m-table > .m-event-live:nth-child(deux) > .m-event-meta > .match-status`,
  },
  {
    name: "allGameMarkets",
    id: "s-13",
    selector: ".m-event-detail-wrap > .live-match > .m-snap-nav-wrap > .m-snap-nav > .m-sport-group-item:nth-child(2)",
  },
  {
    name: "overUnderLine",
    id: "s-14",
    selector: `.m-sport-market > div:nth-child(2) > .m-market > .m-table > .m-table-row`,
  },
  {
    name: "overUnderLineItem",
    id: "s-15",
    selector: `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(une-1) > .m-table-cell:nth-child(1) > em`
  },
  {
    name: "overLineValue",
    id: "s-16",
    selector: `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(une-1) > .m-table-cell:nth-child(2) > em`
  },
  {
    name: "underLineValue",
    id: "s-17",
    selector: `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(une-1) > .m-table-cell:nth-child(3) > em`
  },
  {
    name: "selectLineValue",
    id: "s-18",
    selector:  `.m-sport-market > div:nth-child(2) > .m-market:nth-child(1) > .m-table > .m-table-row:nth-child(une-1) > .m-table-cell:nth-child(3) > em`
  },


  {
    name: "closeFastbetSlip",
    id: "s-19",
    selector:  ".m-bottom-nav > .m-fast-betslip-wrap > .m-fast-betslip > .close-icon"
  },
  {
    name: "expandCurrentBet",
    id: "s-20",
    selector:   ".m-main-mid > .m-bottom-nav > .betslip-float-wrapper > .count-wrapper > .count"
  },
  {
    name: "openVirtualKeyboard",
    id: "s-21",
    selector:   ".m-betslips-stake-wrapper > .m-betslips-stake > .m-input-keyboard-wrapper > .m-input-wrapper > .m-keybord-input"
  },
  {
    name: "clearDefaultBetvalue",
    id: "s-22",
    selector:  ".mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .action"
  },
  {
    name: "keyboardTopValuePress",
    id: "s-23",
    selector:`.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(1) > .m-keyboard-key:nth-child(une-1)`
  },
  {
    name: "keyboardDownValuePress",
    id: "s-24",
    selector:   `.mg-b-10 > .m-keyboard > .flexpad-wrap > .left > .m-keyboard-row:nth-child(2) > .m-keyboard-key:nth-child(une-1)`
  },
  {
    name: "confirmBet",
    id: "s-25",
    selector: ".m-betslips-stake > .m-input-keyboard-wrapper > .m-keyboard > .flexpad-wrap > .right"
  },
  {
    name: "placeBet",
    id: "s-26",
    selector: ".m-betslips-stake-wrapper > .m-betslips-stake > .m-submit > .place-bet > .m-pay-num"
  },
  {
    name: "finishBet",
    id: "s-27",
    selector:  ".m-bet-detail-wrap > div > .confirm-wrap > .button-wrap > .flexibet-confirm"
  },


  {
    name: "sportyPopUps",
    id: "s-28",
    selector:  `[data-op*="close_guide_button"]`
  },
  {
    name: "removeAllbets",
    id: "s-29",
    selector:  ".m-betslip-header > .head-container > .wrapper > .remove-all"
  },
  {
    name: "confirmRemoveAllbets",
    id: "s-30",
    selector:  ".es-dialog-wrap > .es-dialog > .m-dialog-footer > a.es-dialog-btn:nth-child(2)"
  },
  {
    name: "clearPopupBg",
    id: "s-31",
    selector:  ".m-betslip-header > .head-container > .wrapper > .wrapper-item > .icon-font-base"
  },
  {
    name: "acceptChanges",
    id: "s-32",
    selector:  ".bet-accept-change"
  },
  {
    name: "accountBalanceAmount",
    id: "s-33",
    selector:  ".mobile-navbar-right > .m-login-yes > .m-btn-deposit > .avatar-box > span:nth-child(3)"
  },





];

SelectorApi.getSelectorByName = (name) => {
  return selectors.find((selector) => selector.name === name).selector;
};

SelectorApi.getSelectorWithVariables = (name, replacementArr) => {
  const selector = selectors.find((selector) => selector.name === name)
    .selector;
  return replaceMultipleStrings(
    selector,
    ["une-1", "deux", "trox", "quatre"],
    replacementArr
  );
};

function replaceMultipleStrings(string, occurrences, replacements) {
  for (let i = 0; i < replacements.length; i++) {
    string = string.replaceAll(occurrences[i], replacements[i]);
  }
  return string;
}

module.exports = SelectorApi;
