const { SlashCommandBuilder, SlashCommandIntegerOption } = require('@discordjs/builders')
const { min } = require('moment-timezone')
const { writeJsonFile } = require('../util/jsonUtils.js')
const { getUserData } = require('../util/userUtils.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Reminder')
    .addSubcommand(subcommand => {
        return subcommand.setName('set')
        .setDescription('Sets a reminder so that Grombo can alert you to log your daily activities!')
        .addIntegerOption(option => {
            return option.setName('hour')
            .setDescription("The hour of choice")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(24)
        })
        .addIntegerOption(option => {
            return option.setName('minute')
            .setDescription("The minute of choice")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(60)
        })
        .addStringOption(option => {
            return option.setName('timezone')
            .setDescription("Sets the timezone of choice")
            .setRequired(true)
            .addChoices(
                { name: "Eastern Standard Time", value: "America/New_York" },
                { name: "Central Standard Time", value: "America/Matamoros" },
                { name: "Pacific Standard Time", value: "America/Los_Angeles"},
                { name: "Keke Standard Time", value: "Europe/London" }
            )
        })
    })
    .addSubcommand(subcommand => {
        return subcommand.setName('toggle')
        .setDescription('Enables/Disables your reminder')
    }),
    async execute(interaction) {
        const user = interaction.user
        const userData = await getUserData(user)

        if (interaction.options.getSubcommand() === 'set') {
            userData.reminder.timezone = interaction.options.getString('timezone', true)
            userData.reminder.hour = interaction.options.getInteger('hour', true)
            userData.reminder.minute = interaction.options.getInteger('minute', true)
            writeJsonFile('db/', user.id, userData)

            const time = getTimeDisplay(interaction.options.getInteger('hour', true), interaction.options.getInteger('minute', true))

            await interaction.reply({
               content:  `Reminder set to ${time} on ${interaction.options.getString('timezone', true)}!`,
               ephemeral: true
            })
        } 
        else if (interaction.options.getSubcommand() === 'toggle') {
            userData.reminder.enabled = !userData.reminder.enabled
            writeJsonFile('db/', user.id, userData)
            await interaction.reply({
                content: userData.reminder.enabled ? "Reminders are now enabled" : "Reminders are now disabled",
                ephemeral: true
            })
        }
    }
}

function getTimeDisplay(hour = 0, minute = 0) {
    let hourString = hour
    let minuteString = minute

    if (hour == 0) {
        hourString = 0 + hour
    }
    if (minute == 0) {
        minuteString = 0 + minute
    }
    return `${hourString}:${minuteString}`
}
