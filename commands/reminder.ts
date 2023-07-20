import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { SlashCommand } from "../types/types";


export default class ReminderCommand implements SlashCommand {
    public data: SlashCommandBuilder = this.buildCommand();

    private buildCommand(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
        command.setName('reminder')
        command.setDescription('Manage reminders.')

        // reminder settings
        command.addSubcommand(subCmd => {
            subCmd.setName('settings')
            subCmd.setDescription('Change reminder settings.')
            subCmd.addStringOption(option => {
                option.setName('timezone')
                option.setDescription('The timezone of the reminder')
                option.setChoices(
                    { name: 'Eastern Standard Time', value: 'America/New_York' },
                    { name: 'Central Standard Time', value: '' },
                    { name: 'Pacific Standard Time', value: '' },
                    { name: 'Greenwich Mean Time', value: '' }
                )
                option.setRequired(true)
                return option
            })
            subCmd.addIntegerOption(option => {
                option.setName('hour')
                option.setDescription('The hour of the reminder (0-23)')
                option.setMinValue(0)
                option.setMaxValue(23)
                option.setRequired(true)
                return option
            })
            subCmd.addIntegerOption(option => {
                option.setName('minute')
                option.setDescription('The minute of the reminder (0-45)')
                option.setChoices(
                    { name: '0', value: 0 },
                    { name: '15', value: 15 },
                    { name: '30', value: 30 },
                    { name: '45', value: 45}
                )
                option.setRequired(true)
                return option
            })
            return subCmd
        })
        // reminder toggle
        command.addSubcommand(subCmd => {
            subCmd.setName('toggle')
            subCmd.setDescription('Enable or disable reminders.')
            return subCmd
        })
        return command
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const subCommand = interaction.options.getSubcommand(true)
        
        

        
        return subCommand == 'settings' ? this.executeSettings(interaction) : this.executeToggle(interaction)
    }

    private async executeSettings(interaction: ChatInputCommandInteraction<CacheType>) {


        return interaction.reply({


        })
    }

    private async executeToggle(interaction: ChatInputCommandInteraction<CacheType>) {


        return interaction.reply({

            
        })
    }

    
}