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
    [kb.homeBtn],
  ],
  authedMenu: [
    [kb.authedMenu.key, kb.authedMenu.key2],
    [kb.authedMenu.key3],
    [kb.homeBtn],
  ],
}