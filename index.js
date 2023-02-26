require('dotenv').config()
const fs = require('fs')
const { writeJsonFile, readJsonFile, readDir } = require ('./db/dbUtils.js')
const { getCurrentTime, getResetTime } = require('./timeUtils.js') 
const { Client, Intents, Collection, GatewayIntentBits} = require('discord.js')
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]})
const keepAlive = require('./server')
keepAlive()

client.once("ready", async() => {
    console.log("Ready!")
    update()
})

client.on("messageCreate", async msg => {
    if (msg.channelId != "1078859541053186150") return
    const user = msg.author
    
    if (!readJsonFile(`db/users/${user.id}`)) {
        await writeJsonFile(`db/users`, user.id, {
            doneDaily: true,
            streak: 1,
            dailys: []
        })
    }
    const userData = readJsonFile(`db/users/${user.id}`)
    if (getCurrentTime() > getResetTime() && !userData.doneDaily) {
        userData.streak++
        userData.doneDaily = true
    }
    userData.dailys.push({
        content: msg.content,
        date: getCurrentTime()
    })
    writeJsonFile('db/users', user.id, userData)

    const comments = readJsonFile('data/comments')
    try {
        user.send({
            embeds: [
                {
                    title: "Grombo",
                    description: `You've reached a daily streak of ${userData.streak}. ${comments[getRandomNumberBetween(0, comments.length)]}`,
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/764283096803311636/1078858187102498928/Untitled465.png"
                    }
                }
            ]
        })
    } catch (error) {
        console.log(error)
    }
})
client.login(process.env.TOKEN)

function update() {
    for (let userFile of readDir('db/users/')) {
        let userData = readJsonFile(`db/users/${userFile}`)
        if (!userData) continue

        if (getCurrentTime() == getResetTime()) {
            if (!userData.doneDaily) userData.streak = 0
            userData.doneDaily = false
        }
        writeJsonFile('db/users', userFile.split(".")[0], userData)
    }
    setTimeout(update, 1000)
}

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
