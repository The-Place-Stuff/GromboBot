import { tz } from 'moment-timezone'
import { Database } from './database'
import { Client } from 'discord.js'
import { UserData } from '../types/types'
import { Messenger } from './messenger'
import { chooseComment } from './fileUtils'

export class Clock {
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public async update() {
        const currentTime = tz('America/New_York')

        for (const [id, userData] of Database.getUsers()) {
            if (currentTime.isSame({ hours: 6, minutes: 0, seconds: 0 })) {
                console.log('A new day begins!')
                this.resetPost(id, userData)
            }
            this.trySendReminder(id, userData)
        }
    }

    //
    // Sends out a reminder to a user
    //
    private async trySendReminder(id: string, data: UserData) {
        const user = await this.client.users.fetch(id)
        if (!data.reminder) return
        const reminder = data.reminder
        const currentTime = tz(reminder.timezone)
        if (!currentTime.isSame({ hours: reminder.hour, minutes: reminder.minute, seconds: 0 })) return

        Messenger.sendDM(user, this.reminderEmbed())
        console.log(`Sent out a reminder to ${user.username}`)
    }

    

    //
    // Sets a user's posted status to false and resets their streak if they haven't posted that day
    //
    private async resetPost(id: string, data: UserData) {
        const user = await this.client.users.fetch(id)

        if (!data.posted && data.streak > 0) {
            console.log(`${user.username} has lost their streak of ${data.streak}}`)
            Messenger.sendDM(user, this.streakLostEmbed())
            data.streak = 0
        }
        data.posted = false
        Database.updateUser(id, data)
    }

    private reminderEmbed() {
        return Messenger.createEmbed('Reminder from Grombo!', chooseComment('user_reminded'))
    }

    private streakLostEmbed() {
        return Messenger.createEmbed('You lost your streak!', chooseComment('streak_lost'))
    }
}