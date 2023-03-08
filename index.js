require('dotenv').config()
const { writeJsonFile, readDir, selectComment } = require('./util/jsonUtils.js')
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

async function sendReminders() {
  for (const fileName of readDir('db/')) {
    const user = await client.users.fetch(fileName.split(".")[0])

    if (typeof user == 'undefined') continue
    const data = await getUserData(user)

    const now = moment.tz(data.reminder.timezone);

    if (now.hours() === data.reminder.hour && now.minutes() === data.reminder.minute && now.seconds() === 0) {
      console.log(`Attempted to remind ${user.username}`)
      if (data.reminder.enabled) {
        sendDialogue(user, "Hey! Don't forget to send your daily progress!")
      }

    }
  }
}

async function resetDailys() {
  const now = moment.tz('America/New_York')

  if (now.hours() === 6 && now.minutes() === 0 && now.seconds() === 0) {
    console.log("It's the start of a new day!")
    // Grab all user files in the database
    for (let file of readDir('db/')) {
      const user = await client.users.fetch(file.split(".")[0])
      const data = await getUserData(user)
      console.log(data)

      // If they haven't done their daily, they lose their streak.
      if (!data.doneDaily && data.streak > 0) {
        console.log(`${user.username} has lost their daily streak. :(`)
        data.streak = 0
        sendDialogue(user, selectComment("streak_loss"))
      }
      data.doneDaily = false
      writeJsonFile('db/', user.id, data)
    }
  }
}

