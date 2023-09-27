require('dotenv').config()

import { ChatInputCommandInteraction, Client, Collection } from 'discord.js'
import { MessageListener } from './data/messageListener'
import { SlashCommand } from './types/types'
import { readdirSync } from 'fs'
import { Clock } from './data/clock'

const keepAlive = require('./server')
keepAlive()

const CHANNEL_ID = '1078859541053186150'
const DEBUG = '1127727209591865384'

const commands: Collection<string, SlashCommand> = new Collection()
const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'DirectMessages',
        'MessageContent'
    ]
})

client.login(process.env.TOKEN)

client.once('ready', async () => {
    console.log('Grombo is online!')

    const clock = new Clock(client)
    update(clock)
})

async function update(clock: Clock) {
    clock.update()
    setTimeout(() => update(clock), 1000)
}

client.on('messageCreate', async (message) => {
    const messageListener = new MessageListener()
    if (message.channelId != DEBUG || message.author.bot) return
    messageListener.onSend(message)
})

async function registerCommands() {
    const commandFiles: string[] = readdirSync('./commands').filter(file =>
      file.endsWith('.ts' || '.js')
    )
  
    for (const file of commandFiles) {
      const Command = (await import(`./commands/${file}`)).default
  
      const command: SlashCommand = new Command()
  
      commands.set(command.data.name, command)
    }
}
registerCommands()

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName) as SlashCommand
    if (!command) return

    try {
        command.execute(interaction as ChatInputCommandInteraction)
    } catch (error) {
        console.warn(error)
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        })
    }
})
