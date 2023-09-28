import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/types";
import { Database } from "../data/database";
import { FAIL_REGISTER, SUCCESS_REGISTER } from "../data/messenger";

export default class RegisterCommand implements SlashCommand {
    public data: SlashCommandBuilder = this.buildCommand()

    private buildCommand(): SlashCommandBuilder {
        const command = new SlashCommandBuilder()
        command.setName('register')
        command.setDescription('Register as a Grombo user.')
        return command
    }

    public async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const user = interaction.user
        if (Database.getUser(user.id)) {
            return interaction.reply({
                embeds: [ FAIL_REGISTER ],
                ephemeral: true
            })
        }
        Database.createUser(user.id, true)
        return interaction.reply({
            embeds: [ SUCCESS_REGISTER ],
            ephemeral: true
        })
    }
}