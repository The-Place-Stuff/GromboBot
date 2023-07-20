import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

type UserData = {
    streak: number,
    posted: boolean,
    reminder: Reminder | false
}

type Reminder {
    timezone: string,
    hour: number,
    minute: number
}

interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void
}