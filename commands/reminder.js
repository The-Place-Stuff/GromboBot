const { SlashCommandBuilder, SlashCommandIntegerOption } = require('@discordjs/builders')
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
        const userData = getUserData(user)

        if (interaction.options.getSubcommand() === 'set') {
            userData.reminder = {
                timezone: interaction.options.getStringOption('timezone'),
                hour: interaction.options.getIntegerOption('hour'),
                minute: interaction.options.getIntegerOption('minute')
            }
            writeJsonFile('db/', user.id, userData)
            await interaction.reply(`Timezone set!`)
        } 
        else if (interaction.options.getSubcommand() === 'toggle') {
            if (typeof userData.reminder.enabled == "undefined") userData.reminder.enabled = true
    
            userData.reminder.enabled = !userData.reminder.enabled
            await interaction.reply(userData.reminder.enabled ? "Reminders are now enabled" : "Reminders are now disabled")
        }
    }
}
