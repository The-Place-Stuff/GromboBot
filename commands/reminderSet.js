const { SlashCommandBuilder, SlashCommandIntegerOption } = require('@discordjs/builders')
const { readJsonFile } = require('../util/jsonUtils')
import('discord.js').Interaction

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reminder set")
    .setDescription("Sets a reminder so that Grombo can alert you to log your daily activities!")
    .addIntegerOption((option) => {
        option.setName("Hour").setRequired()

        option.min_value = 0
        option.max_value = 24
    })
    .addIntegerOption((option) => {
        option.setName("Minute").setRequired()

        option.min_value = 0
        option.max_value = 60
    }),

    async execute(interaction) {
    
        await interaction.reply()
    }
}
