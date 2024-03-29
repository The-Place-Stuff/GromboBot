import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, time } from "discord.js";
import { SlashCommand } from "../types/types";
import { Database } from "../data/database";
import { Messenger, REMINDER_DISABLE, REMINDER_ENABLE, FAIL_REMINDER } from "../data/messenger";

const locationToTZ: Map<string, string> = new Map()
locationToTZ.set('America/New_York', 'ET')
locationToTZ.set('America/Ojinaga', 'CT')
locationToTZ.set('America/Los_Angeles', 'PT')
locationToTZ.set('Europe/London', 'KT')

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
                    { name: 'Eastern Time', value: 'America/New_York' },
                    { name: 'Central Time', value: 'America/Ojinaga' },
                    { name: 'Pacific Time', value: 'America/Los_Angeles' },
                    { name: 'Keke Time', value: 'Europe/London'}
                )
                option.setRequired(true)
                return option
            })
            subCmd.addIntegerOption(option => {
                option.setName('hour')
                option.setDescription('The hour of the reminder')
                option.setChoices(
                    { name: '12:00 AM', value: 0 },
                    { name: '01:00 AM', value: 1 },
                    { name: '02:00 AM', value: 2 },
                    { name: '03:00 AM', value: 3 },
                    { name: '04:00 AM', value: 4 },
                    { name: '05:00 AM', value: 5 },
                    { name: '06:00 AM', value: 6 },
                    { name: '07:00 AM', value: 7 },
                    { name: '08:00 AM', value: 8 },
                    { name: '09:00 AM', value: 9 },
                    { name: '10:00 AM', value: 10 },
                    { name: '11:00 AM', value: 11 },
                    { name: '12:00 PM', value: 12 },
                    { name: '01:00 PM', value: 13 },
                    { name: '02:00 PM', value: 14 },
                    { name: '03:00 PM', value: 15 },
                    { name: '04:00 PM', value: 16 },
                    { name: '05:00 PM', value: 17 },
                    { name: '06:00 PM', value: 18 },
                    { name: '07:00 PM', value: 19 },
                    { name: '08:00 PM', value: 20 },
                    { name: '09:00 PM', value: 21 },
                    { name: '10:00 PM', value: 22 },
                    { name: '11:00 PM', value: 23 },
                )
                option.setRequired(true)
                return option
            })
            subCmd.addIntegerOption(option => {
                option.setName('minute')
                option.setDescription('The minute of the reminder')
                option.setChoices(
                    { name: '00:00', value: 0 },
                    { name: '00:15', value: 15 },
                    { name: '00:30', value: 30 },
                    { name: '00:45', value: 45}
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
        const user = interaction.user
        const data = Database.getUser(user.id)
        const timezone = interaction.options.getString('timezone', true)
        const hour = interaction.options.getInteger('hour', true)
        const minute = interaction.options.getInteger('minute', true)
        
        if (!data) return interaction.reply({
            embeds: [ FAIL_REMINDER ],
            ephemeral: true
        })
        data.reminder = {
            timezone,
            hour,
            minute
        }
        Database.updateUser(user.id, data)
        const reminder = `${hour < 10 ? '0' : ''}${hour}:${minute == 0 ? '0' : ''}${minute} ${locationToTZ.get(timezone)}`

        return interaction.reply({
            embeds: [ 
                Messenger.createEmbed('Updated reminder settings!', `You will receive reminders at ${reminder}.`) 
            ],
            ephemeral: true
        })
    }

    private async executeToggle(interaction: ChatInputCommandInteraction<CacheType>) {
        const user = interaction.user
        const data = Database.getUser(user.id)

        if (!data) return interaction.reply({
            embeds: [ FAIL_REMINDER ],
            ephemeral: true
        })
        data.remindersEnabled = !data.remindersEnabled
        Database.updateUser(user.id, data)
        return interaction.reply({
            embeds: [ data.remindersEnabled ? REMINDER_ENABLE : REMINDER_DISABLE ],
            ephemeral: true
        })
    }
}