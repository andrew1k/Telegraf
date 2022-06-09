const { Markup, Composer, Scenes, session } = require('telegraf')
const axios = require('axios')
const keyboard = require('../keyboard/keyboard.js')
const kb = require('../keyboard/keyboard-buttons.js')
const replies = require('../keyboard/keyboard-reply.js')

const guestLoginStep = new Composer()
guestLoginStep.on('text', async ctx => {
  let unauthorizedUser = {
    'telegramFirstName': ctx.message.chat.first_name,
    'id': ctx.message.chat.id,
    'username': ctx.message.chat.username,
    'isAuthorized': false
  }
  await axios.put(`${process.env.DB_URL}/telegramUsers/unregistered/${ctx.message.chat.id}.json`, unauthorizedUser)
  await ctx.reply(kb.homeBtn, Markup.keyboard(keyboard.unauthedMenu).resize())
  return ctx.scene.leave()
})

const guestLoginScene = new Scenes.WizardScene('guestLoginScene', guestLoginStep)

module.exports = guestLoginScene