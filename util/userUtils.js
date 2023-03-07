async function getUserData(user) {
    if (!readJsonFile(`db/${user.id}`)) {
      writeJsonFile(`db`, user.id, {
        name: user.username,
        doneDaily: false,
        streak: 0,
        dailys: [],
        reminder: {
          timezone: "EST",
          hour: "24",
          minute: "0"
        }
      })
    }
    return readJsonFile(`db/${user.id}`)
}

function sendDialogue(user, msg = "") {
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

module.exports = {
  getUserData,
  sendDialogue
}