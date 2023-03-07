require('dotenv').config()
const { writeJsonFile, readJsonFile, readDir, selectComment } = require('./util/jsonUtils.js')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('fs')
const { sendDialogue, getUserData } = require('./util/userUtils.js')
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

client.commands = new Collection()
for (let commandFile of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
  const command = require(`./commands/${commandFile}`)
  client.commands.set(command.data.name, command)
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  }
  catch (error) {
    console.log(error)
    await interaction.reply({
      content: 'There was an error while executing this command',
      ephemeral: true
    })
  }
})

// Fires when a message is sent
client.on("messageCreate", async msg => {
  if (msg.channelId != "1078859541053186150") return

  const user = msg.author
  const userData = await getUserData(user)

  userData.dailys.push({
    content: msg.content,
    date: new Date().getTime()
  })
  userData.name = user.username
  
  // We need to wrap this in a try-catch, for users who have DMs disabled
  try {
    if (!userData.doneDaily) {
      userData.streak++
      console.log(`${userData.name} has reached a streak of ${userData.streak}`)
    }

    // Let's define the message depending if the daily activity has been done.
    const description = userData.doneDaily ? selectComment("comments") : `You've reached a streak of ${userData.streak}. ${selectComment("comments")}`

    // Let's send the user a DM when they submit their daily activites
    sendDialogue(user, description)
    if (!userData.doneDaily) userData.doneDaily = true

    writeJsonFile('db', user.id, userData)
  } catch (error) {
    console.error(error)
  }
})

client.once("ready", async () => {
  console.log("Ready!")
  update()
})
client.login(process.env.TOKEN)

function update() {
  resetDailys()
  sendReminders()
  setTimeout(update, 1000)
}

function sendReminders() {
  for (const userFile of readDir('db/')) {
    const user = client.users.cache.get(userFile.split(".")[0])
    const data = getUserData(user)
    
    if (typeof data.reminder == "undefined") return
  
    const now = moment.tz(data.reminder.timezone);
    
    if (now.hours() === data.reminder.hour && now.minutes() === data.reminder.minute && now.seconds() === 0) {
      console.log(`Reminded ${data.name} to do their daily!`)
      sendDialogue(user, "Hey! Don't forget to send your daily progress!")
    }
  }
}

function resetDailys() {
  const now = moment.tz('America/New_York')

  if (now.hours() === 6 && now.minutes() === 0 && now.seconds() === 0) {
    console.log("It's the start of a new day!")
    // Grab all user files in the database
    for (let user of readDir('db/')) {
      const userId = user.split(".")[0]
      const userData = readJsonFile(`db/${userId}`)
      if (!userData) continue
  
      // If they haven't done their daily, they lose their streak.
      if (!userData.doneDaily) {
        console.log(`${userData.name} has lost their daily streak. :(`)
        userData.streak = 0
        sendDialogue(client.users.cache.get(userId), selectComment("streak_loss"))
      }
      userData.doneDaily = false
      writeJsonFile('db/', user, userData)
    }
  }
}

