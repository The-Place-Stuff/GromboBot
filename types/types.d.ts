import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

type User = {
    streak: number,
    posted: boolean,
    reminder: boolean
}

interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void
}