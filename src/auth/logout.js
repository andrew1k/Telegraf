const {Markup, Scenes, Composer, session} = require('telegraf')
const axios = require('axios')
const keyboard = require('../keyboard/keyboard.js')
const replies = require('../keyboard/keyboard-reply.js')

const startLogout = new Composer()
startLogout.on('text', ctx => {
  ctx.reply('Выйти из учетной записи?', Markup.keyboard([['Да','Нет']]).resize())
  return ctx.wizard.next()
})
const finishLogout = new Composer()
finishLogout.on('text',async ctx => {
  if (ctx.message.text === 'Да') {
    ctx.session.isAuthorized = false
    await axios.patch(`${process.env.DB_URL}/telegramUsers/registered/${ctx.message.chat.id}.json`, {isAuthorized: false})
    await ctx.reply(replies.startBntAction, Markup.keyboard(keyboard.authKeyboard).resize())
    return ctx.scene.leave()
  } if (ctx.message.text === 'Нет') {
    ctx.reply('Main menu', Markup.keyboard(keyboard.authedMenu).resize())
    return ctx.scene.leave()
  } else {
    return ctx.scene.leave()
  } 
})

const logoutScene = new Scenes.WizardScene('logoutScene', startLogout, finishLogout)
module.exports = logoutScene