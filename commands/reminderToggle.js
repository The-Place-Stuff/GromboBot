const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reminder toggle")
    .setDescription("Toggles the Grombo reminder"),

    async execute(interaction) {
        await interaction.reply()
    }
}
