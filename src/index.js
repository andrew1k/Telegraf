const {
  Telegraf,
  Markup,
  Composer,
  Scenes,
  session,
} = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)
const axios = require('axios')

const loginScene = require('./auth/auth.js')
const logoutScene = require('./auth/logout.js')
const guestLoginScene = require('./auth/guestauth.js')

const keyboard = require('./keyboard/keyboard.js')
const kb = require('./keyboard/keyboard-buttons.js')
const replies = require('./keyboard/keyboard-reply.js')
// ---------------------------------------------------------------------------------------------------- Scenes ------------------------------------------------------------------------------------
// Сцены для исполнения определенных последовательный действий, например вход или регистрация
// Создается сцена, где исполняются сессии loginScene и тд...
const stage = new Scenes.Stage([loginScene, logoutScene, guestLoginScene])

// В session хранятся нужные перенные для сессии в телеграм, т.к. в телеграм нет своей сессии(Вроде localStorage в браузере)
// Проблема в том, что при обновлении бота теряется сессия, что не будет удобно пользователям. Поэтому на каждой прослушке событий 
// придется записывать данные сессий в бд и брать их оттуда, когда бот перезагружается...
bot.use(session())
bot.use(stage.middleware())
// ---------------------------------------------------------------------------------------------------- Start --------------------------------------------------------------------------------------
// Бот слушает сообщение /start и создает переменную ctx в которой информация об отправителе, его id, name, само сообщение и тд... 
// ctx.reply - отвечает обратным сообщением ctx.reply('message here', opts)
// Обратное сообщение взято из replies и вместе с сообщением выводится клавиатура Markup.keyboard
// Клавиатура из файла keyboard, метод resize() для обновления размера кнопок к стандартному значению
bot.start(ctx => ctx.reply(replies.startBntAction, Markup.keyboard(keyboard.authKeyboard).resize()))
// ---------------------------------------------------------------------------------------------------- Auth ---------------------------------------------------------------------------------------
// Тоже самое, бот слушает сообщение из клавиатуры
bot.hears(kb.loginBtn, async ctx => {
  ctx.session.isAuthorized = await axios.get(`${process.env.DB_URL}/telegramUsers/registered/${ctx.chat.id}/isAuthorized.json`) // как описано ранее, есть баг с хранением session | Пока хранится только состояние isAuthorized
  ctx.session.isAuthorized.data ? ctx.reply('Menu', Markup.keyboard(keyboard.authedMenu).resize()) : ctx.scene.enter('loginScene') // Выполняется проверка на isAuthorized, и если false или undefined то запускается сцена loginScene
})
bot.hears(kb.guestLoginBtn, async ctx => {
  ctx.session.isAuthorized = await axios.get(`${process.env.DB_URL}/telegramUsers/registered/${ctx.chat.id}/isAuthorized.json`)
  ctx.session.isAuthorized.data ? ctx.reply('Menu', Markup.keyboard(keyboard.authedMenu).resize()) : ctx.scene.enter('guestLoginScene')
})
bot.command('logout', async ctx => {
  ctx.session.isAuthorized = await axios.get(`${process.env.DB_URL}/telegramUsers/registered/${ctx.chat.id}/isAuthorized.json`)
  ctx.session.isAuthorized.data ? ctx.scene.enter('logoutScene') : ctx.reply(replies.startBntAction, Markup.keyboard(keyboard.authKeyboard).resize())
})
// ---------------------------------------------------------------------------------------------------- 
bot.hears('Serv', async ctx => {
  if (ctx.session.isAuthorized) 
  {
    console.log(ctx.session.isAuthorized.data);
  } else {
    let {data: isAuthorized} = await axios.get(`${process.env.DB_URL}/telegramUsers/registered/${ctx.chat.id}/isAuthorized.json`)
    console.log('Just get it: ' + isAuthorized);
  }
})





bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))