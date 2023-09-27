import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

type UserData = {
    dailyStreak: number,
    coins: number,
    messageSent: boolean,
    remindersEnabled: boolean
    reminder?: Reminder
}

type Reminder = {
    timezone: string,
    hour: number,
    minute: number
}

interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void
}