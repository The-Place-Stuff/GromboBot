const { readJsonFile, writeJsonFile } = require('./jsonUtils.js')

async function getUserData(user) {
    if (!readJsonFile(`db/${user.id}`)) {
        writeJsonFile(`db`, user.id, {
          name: user.username,
          streak: 0,
          doneDaily: false,
          dailys: [],
          reminder: {
            enabled: true,
            timezone: 'America/New_York',
            hour: 24,
            minute: 0
          }
      })
    }
    return readJsonFile(`db/${user.id}`)
}

function sendDialogue(user, msg = "") {
  try {
    user.send({
      embeds: [
        {
          title: 'Grombo',
          description: msg,
          thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/764283096803311636/1078858187102498928/Untitled465.png'
          }
        }
      ]
    })
  }
  catch (error) {
    console.warn(error)
  }
}

module.exports = {
  getUserData,
  sendDialogue
}