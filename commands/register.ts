import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/types";
import { UserManager } from '../data/userManager'

export default class RegisterCommand implements SlashCommand {
    public data: SlashCommandBuilder = this.buildCommand()
    private dailyGoals = 'https://discord.com/channels/741121896149549160/1078859541053186150'

    private buildCommand(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
        command.setName('register')
        command.setDescription('Create a Grombo account.')
        command.addBooleanOption(option => {
            option.setName('enable_reminder')
            option.setDescription('Would you like to receive a reminder an hour before? (You can change this later!)')
            option.setRequired(true)
            return option
        })
        return command
    }

    public async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const user = interaction.user
        const reminder = interaction.options.getBoolean('enable_reminder', true)
        
        if (typeof UserManager.getDatabase().get(user.id) !== 'undefined') {
            return interaction.reply({
                embeds: [
                    {
                        title: 'Failed to register!',
                        description: `It seems you already have registered! Silly you!`
                    }
                ],
                ephemeral: true
            })
        }

        UserManager.createUser(user.id, reminder)
    
        return interaction.reply({
            embeds: [
                {
                    title: 'Welcome to Grombo\'s Goals!',
                    description: `Thank you for registering! You can now build a streak in ${this.dailyGoals}!`
                }
            ],
            ephemeral: true
        })
    }
}