SelectorApi = {};

const selectors = [
  {
    name: "toCasino",
    id: "a-01",
    selector:
      ".m-snap-nav-wrap > .m-snap-nav > .m-sports-choose-item:nth-child(3) > a > .sport-icon",
  },
  {
    name: "clickAviator",
    id: "a-02",
    selector: "#game_item19",
  },
  {
    name: "clickAviatorNext",
    id: "a-03",
    selector: "game-19",
  },
  {
    name: "clickAutoBet",
    id: "a-03",
    selector: ".navigation-switcher > ng-star-inserted:nth-child(3)",
  },
  //parimatch login
  {
    name: "toLogin",
    id: "p-01",
    selector: "#header-layout > .header__wrapper > .header__user-nav > #loginButton > i18n-t",
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
