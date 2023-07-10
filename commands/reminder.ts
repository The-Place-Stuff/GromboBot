import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { SlashCommand } from "../types/types";
import { UserManager } from "../data/userManager";


export default class ReminderCommand implements SlashCommand {
    public data: SlashCommandBuilder = this.buildCommand()

    private buildCommand(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
        command.setName('reminder')
        command.setDescription('Toggles the ability to receive reminders')
        return command
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const user = UserManager.getUser(interaction.user.id)

        if (!user) return interaction.reply({
            embeds: [
                {
                    title: 'Failed to toggle reminders',
                    description: `You don't seem to be registered.`
                }
            ],
            ephemeral: true
        })

        user.reminder = !user.reminder
        UserManager.updateUser(interaction.user.id, user)
        return interaction.reply({
            embeds: [
                {
                    title: 'Reminders updated!',
                    description: `Receive reminders is now set to ${user.reminder}!`
                }
            ],
            ephemeral: true
        })
    }
}