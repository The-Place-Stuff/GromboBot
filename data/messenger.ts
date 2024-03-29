import { APIEmbed, User } from 'discord.js'

export class Messenger {

    public static sendDM(user: User, embed: APIEmbed) {
        const directMsg = user.send({
            embeds: [ embed ]
        })
        directMsg.catch((error) => console.warn(error))
    }

    public static createEmbed(title: string, description: string) {
        const embed: APIEmbed = {
            title: title,
            description: description,
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/764283096803311636/1078858187102498928/Untitled465.png'
            },
            color: 0xff66d6
        }
        return embed
    }
}

const dailyGoals = 'https://discord.com/channels/741121896149549160/1078859541053186150'

export const SUCCESS_REGISTER: APIEmbed = Messenger.createEmbed('Welcome to Grombo\'s Goals', `You can now start posting in ${dailyGoals}!`)
export const FAIL_REGISTER: APIEmbed = Messenger.createEmbed('Failed to register!', 'It seems you have already registered in the past... Silly you!')

export const FAIL_REMINDER: APIEmbed = Messenger.createEmbed('Failed to execute command!', 'It seems you do not have a Grombo account.')
export const REMINDER_ENABLE: APIEmbed = Messenger.createEmbed('Toggled reminders!', 'Reminders are now enabled!')
export const REMINDER_DISABLE: APIEmbed = Messenger.createEmbed('Toggled reminders!', 'Reminders are now disabled!')

export const MESSAGE_FAILED: APIEmbed = Messenger.createEmbed('Aren\' you forgetting something?', 'Make an account with /register to start tracking your progress!')