const { Markup, Composer, Scenes, session } = require('telegraf')
const axios = require('axios')
const keyboard = require('../keyboard/keyboard.js')

// Создается первый шаг, в нем создается локальное хранилище в ctx.wizard.state 
// Запрашивается email и переходит на следующий шаг, email записывается в хранилище уже на следующем шаге
const startLogin = new Composer()
startLogin.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data = {}
    await ctx.reply('Введите ваш email', Markup.removeKeyboard())
    return ctx.wizard.next()
  } catch (e) {console.log(e)}})
// в ctx.wizard.state.data записывается email и переходит к следующему шагу спрашивая password 
const loginEmail = new Composer()
loginEmail.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.loginEmail = ctx.message.text
    await ctx.reply('Введите пароль')
    return ctx.wizard.next()
  } catch (e) {console.log(e)}})
// В хранилище записывается password и произходит валидация email & password 
const loginPassword = new Composer()
loginPassword.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.loginPassword = ctx.message.text
    // данные с emaail & password отправляются на сервер, и при 200 возвращает data, оттуда мы и перем ключ для isAuthorizaed
    let {data} = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`, {
      email:ctx.wizard.state.data.loginEmail,
      password:ctx.wizard.state.data.loginPassword,
      returnSecureToken:true})
    ctx.session.localId = data.localId
    ctx.session.isAuthorized = true
    // Затем все данные о пользователе собираются и записываются в бд
    let authorizedUser = {'telegramFirstName' : ctx.message.chat.first_name,
    'username': ctx.message.chat.username,
    'isAuthorized': true,
    'email': ctx.wizard.state.data.loginEmail}
    await axios.put(`${process.env.DB_URL}/telegramUsers/registered/${ctx.message.chat.id}.json`, authorizedUser)

    // Для синхронизации данных, проверяет каждый email, и если совпадает, то записывает ключи в бд друг друга
    // ! Нуждается в оптимизации
    const {data: appUsers} = await axios.get(`${process.env.DB_URL}/appUsers.json`)
    const {data: telegramUsers} = await axios.get(`${process.env.DB_URL}/telegramUsers/registered.json`)
    for(let appKey in appUsers) {
      for(let telegramKey in telegramUsers) {
        if (appUsers[appKey].email === telegramUsers[telegramKey].email) {
          await axios.patch(`${process.env.DB_URL}/telegramUsers/registered/${telegramKey}.json`, {
            'appId': appKey,
            'birthDate': appUsers[appKey].birthDate,
            'firstName': appUsers[appKey].firstName,
            'secondName': appUsers[appKey].secondName,
            'authLevel': appUsers[appKey].authLevel,
            'personGender': appUsers[appKey].personGender,
            'phoneNumber': appUsers[appKey].phoneNumber,
          })
          await axios.patch(`${process.env.DB_URL}/appUsers/${appKey}.json`, {
            'telegramId': telegramKey, 
            'telegramFirstName': telegramUsers[telegramKey].telegramFirstName,
            'telegramUsername': telegramUsers[telegramKey].username,
            'telegramIsAuthorized': telegramUsers[telegramKey].isAuthorized
          })
        }
      }
    }
    // если все прошло на 200 то выходит клавиатура со входом
    await ctx.reply('Добро пожаловать', Markup.keyboard([['Войти']]).resize())
    return ctx.wizard.next()
  } catch (e) {
    console.log(e.response.data.error)
    // если 400 и тд. то выходит ошибка пользователю и завершает сцену
    ctx.reply('Неверный email или пароль', Markup.keyboard(keyboard.authKeyboard).resize())
    return ctx.scene.leave()
  }})
  // Последний шаг в сцене, и если все ок, то выводит главную клавиатуру и выходит из сцены
const finishLogin = new Composer()
finishLogin.on('text', ctx => {
  ctx.reply('Main menu', Markup.keyboard(keyboard.authedMenu).resize())
  return ctx.scene.leave()
})

// Сдесь создается новая wizard сцена и её шаги startLogin, loginEmail и тд...
const loginScene = new Scenes.WizardScene('loginScene', startLogin, loginEmail, loginPassword, finishLogin)


module.exports = loginScene