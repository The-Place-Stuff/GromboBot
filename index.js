require('dotenv').config()
const fs = require('fs')
const { writeJsonFile, readJsonFile, readDir } = require ('./util/jsonUtils.js')
const { getCurrentTime, getResetTime } = require('./util/timeUtils.js') 
const { Client, GatewayIntentBits} = require('discord.js')
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]})
const comments = readJsonFile('data/comments')
const keepAlive = require('./server')
keepAlive()

client.once("ready", async() => {
    console.log("Ready!")
    update()
})

// Fires when a message is sent
client.on("messageCreate", async msg => {
    // If this isn't the daily goals channel, we cancel this.
    if (msg.channelId != "1078859541053186150") return

    // Let's grab the userData of whoever sent the message, and a random comment from Grombo
    const user = msg.author
    const userData = readJsonFile(`db/${user.id}`)
    const comment = comments[getRandomNumberBetween(0, comments.length - 1)]

    // Let's create a file in the case where they don't exist in the database.
    if (!userData) {
        writeJsonFile(`db`, user.id, {
            name: user.username,
            doneDaily: false,
            streak: 0,
            dailys: []
        })
    }

    // Let's push an entry to their daily messages that contains the content and date.
    userData.dailys.push({
        content: msg.content,
        date: getCurrentTime()
    })

    // Let's try to send a message, since some users may have DMs disabled
    try {
        // We need to seperate when streak and doneDaily are set to display different messages
        if (canIncrementStreak(userData)) userData.streak++

        // Let's update the name
        userData.name = user.username

        // Let's define the message depending if the daily activity has been done.
        const description = userData.doneDaily ? comment : `You've reached a streak of ${userData.streak}. ${comment}`

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
        if (canIncrementStreak(userData)) userData.doneDaily = true

        // Finally, add json data
        writeJsonFile('db', user.id, userData)
    } catch (error) {
        console.log(error)
    }
})

function update() {
    // Grab all files in the database
    for (const userFile of readDir('db/')) {
        const userData = readJsonFile(`db/${userFile}`)
        if (!userData) continue

        // Let's check if the current time is the reset time and reset dailys to false.
        if (getCurrentTime() == getResetTime()) {
            // If a user hasn't done their daily time, reset their streak to 0
            if (!userData.doneDaily) {
                console.log(`${userData.name} has lost their daily streak. :(`)
                userData.streak = 0
            }
            userData.doneDaily = false
            console.log("It's the start of a new day!")
        }
        // Add json data
        writeJsonFile('db/', userFile.split(".")[0], userData)
    }
    // Loops this function every second
    setTimeout(update, 1000)
}

function canIncrementStreak(userData) {
    return getCurrentTime() > getResetTime() && !userData.doneDaily
}

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
