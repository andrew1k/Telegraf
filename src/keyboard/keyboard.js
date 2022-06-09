// Хранятся разные клавиатуры, названия кнопок берутся из keyboard-buttons и они же потом проверяются в основном процессе 
// Клавиатура хранится в состоянии массив массивов, где внешний массив сама клавиатура, а последующие массивы строки клавиатуры
// Во внутренних массивах так же можно сделать колоны кнопок, перечисляя их во внутреннем массиве
const kb = require('./keyboard-buttons.js')
module.exports = {
  authKeyboard: [
    [kb.loginBtn],
    [kb.guestLoginBtn],
  ],
  unauthedMenu: [
    [kb.calendarBtn],
    [kb.unauthedMenu.learnMoreBtn],
    [kb.webLinksBtn]
  ],
  authedMenu: [
    [kb.calendarBtn],
    [kb.authedMenu.smallGroupsBtn],
    [kb.authedMenu.servBtn],
    [kb.authedMenu.learnMoreBtn],
    [kb.authedMenu.askToPrayBtn],
    [kb.authedMenu.gotAQuestionsBtn],
    [kb.homeBtn],
  ],
  leaderAuthedMenu: [
    [kb.calendarBtn],
    [kb.authedMenu.smallGroupsMaterialsBtn],
    [kb.authedMenu.servBtn],
    [kb.authedMenu.learnMoreBtn],
    [kb.authedMenu.askToPrayBtn],
    [kb.authedMenu.gotAQuestionsBtn],
    [kb.homeBtn],
  ],
  ministerAuthedMenu: [
    [kb.calendarBtn],
    [kb.authedMenu.smallGroupsBtn],
    [kb.authedMenu.servBtn],
    [kb.authedMenu.learnMoreBtn],
    [kb.authedMenu.askToPrayBtn],
    [kb.authedMenu.gotAQuestionsBtn],
    [kb.homeBtn],
  ],
  unauthedLearnMore: [
    [kb.unauthedMenu.learnMore.aboutChurch, kb.unauthedMenu.learnMore.aboutSteps],
    [kb.unauthedMenu.learnMore.aboutPastors, kb.unauthedMenu.learnMore.aboutHelp],
    [kb.unauthedMenu.learnMore.aboutStart, kb.unauthedMenu.learnMore.aboutServ],
    [kb.unauthedMenu.learnMore.aboutSmallGroups, kb.unauthedMenu.learnMore.aboutSocialWork],
    [kb.homeBtn],
  ],
}