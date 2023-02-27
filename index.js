require('dotenv').config()
const { writeJsonFile, readJsonFile, readDir } = require('./util/jsonUtils.js')
const { Client, GatewayIntentBits } = require('discord.js')
const moment = require('moment-timezone')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})
const keepAlive = require('./server')
keepAlive()

client.once("ready", async () => {
  console.log("Ready!")
  update()
})
client.login(process.env.TOKEN)

// Fires when a message is sent
client.on("messageCreate", async msg => {
  // If this isn't the daily goals channel, we cancel this.
  if (msg.channelId != "1078859541053186150") return

  // Let's grab the userData of whoever sent the message, and a random comment from Grombo
  const user = msg.author

  // Let's create a file in the case where they don't exist in the database.
  await createNewUser(user)
  const userData = readJsonFile(`db/${user.id}`)

  // Let's push relevant data, such as the contents of the message and also update their username.
  userData.dailys.push({
    content: msg.content,
    date: new Date().getTime()
  })
  userData.name = user.username
  

  // We need to wrap this in a try-catch, for users who have DMs disabled
  try {
    // We need to seperate when streak and doneDaily are set to display different messages
    if (!userData.doneDaily) {
      userData.streak++
      console.log(`${userData.name} has reached a streak of ${userData.streak}`)
    }

    // Let's define the message depending if the daily activity has been done.
    const description = userData.doneDaily ? sendComment() : `You've reached a streak of ${userData.streak}. ${sendComment()}`

    // Let's send the user a DM when they submit their daily activites
    user.send({
      embeds: [
        {
          title: 'Grombo',
          description: description,
          thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/764283096803311636/1078858187102498928/Untitled465.png'
          }
        }
      ]
    })
    if (!userData.doneDaily) userData.doneDaily = true

    // Finally, add json data
    writeJsonFile('db', user.id, userData)
  } catch (error) {
    console.log(error)
  }
})

function update() {
  // Let's grab the current time in EST timezone
  const now = moment.tz('America/New_York')

  // Resets dailys
  if (now.hours() === 3 && now.minutes() === 0 && now.seconds() === 0) {
    console.log("It's the start of a new day!")
    resetDailys()
  }
  // Loops this function every second
  setTimeout(update, 1000)
}

async function createNewUser(user) {
  if (!readJsonFile(`db/${user.id}`)) {
    writeJsonFile(`db`, user.id, {
      name: user.username,
      doneDaily: false,
      streak: 0,
      dailys: []
    })
  }
}

function sendComment() {
  const comments = readJsonFile('data/comments')
  return comments[getRandomNumberBetween(0, comments.length - 1)]
}

function resetDailys() {
  // Grab all user files in the database
  for (let userFile of readDir('db/')) {
    userFile = userFile.split(".")[0]
    const userData = readJsonFile(`db/${userFile}`)
    if (!userData) continue

    // If they haven't done their daily, they lose their streak.
    if (!userData.doneDaily) {
      console.log(`${userData.name} has lost their daily streak. :(`)
      userData.streak = 0
    }
    userData.doneDaily = false
    // Write json data
    writeJsonFile('db/', userFile, userData)
  }
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
