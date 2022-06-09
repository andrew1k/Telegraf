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
    const {data: appId} = await axios.get(`${process.env.DB_URL}/telegramUsers/registered/${ctx.message.chat.id}/appId.json`)
    await axios.patch(`${process.env.DB_URL}/appUsers/${appId}.json`, {telegramIsAuthorized: false})
    await axios.delete(`${process.env.DB_URL}/telegramUsers/registered/${ctx.message.chat.id}.json`)
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