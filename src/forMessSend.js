let text = 'asdfasdfasdfasdfasdfasdfasdfasdf'
let chat_ids = await axios.get(`https://telegraf-e4d87-default-rtdb.europe-west1.firebasedatabase.app/users/unregistered.json`)
let chat_arr = Object.keys(chat_ids.data)
chat_arr.forEach(item => {axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${item}&text=${text}`)})

// Для синхронизации данных, проверяет каждый email, и если совпадает, то записывает ключи в бд друг друга
const {data: appUsers} = await axios.get(`${process.env.DB_URL}/appUsers.json`)
const {data: telegramUsers} = await axios.get(`${process.env.DB_URL}/telegramUsers/registered.json`)
for(let appKey in appUsers) {
  for(let telegramKey in telegramUsers) {
    if (appUsers[appKey].email === telegramUsers[telegramKey].email) {
      await axios.patch(`${process.env.DB_URL}/telegramUsers/registered/${telegramKey}.json`, {'appId': appKey})
      await axios.patch(`${process.env.DB_URL}/appUsers/${appKey}.json`, {'telegramId': telegramKey})
    }
  }
}