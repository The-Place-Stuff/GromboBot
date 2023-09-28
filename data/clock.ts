import { Moment, tz } from 'moment-timezone'
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
            if (Clock.isSameTime(currentTime, 6, 0)) {
                console.log('A new day begins!')
                this.reset(id, userData)
            }
            this.trySendReminder(id, userData)
        }
    }

    /*
        Attempts to send a reminder to a user.
    */
    private async trySendReminder(id: string, data: UserData) {
        const user = await this.client.users.fetch(id)

        if (!data.messageSent || !data.reminder || !data.remindersEnabled) return
        const reminder = data.reminder
        const currentTime = tz(reminder.timezone)

        if (!Clock.isSameTime(currentTime, reminder.hour, reminder.minute)) return

        Messenger.sendDM(user, this.reminderEmbed())
        console.log(`Sent out a reminder to ${user.username}`)
    }

    /*
        Begins a brand new day!
        Resets `dailyStreak` for those who haven't sent a message.
        Will also reset everyone's `messageSent` status.
    */
    private async reset(id: string, data: UserData) {
        const user = await this.client.users.fetch(id)

        if (!data.messageSent && data.dailyStreak > 0) {
            console.log(`${user.username} has lost their streak of ${data.dailyStreak}}`)
            Messenger.sendDM(user, this.streakLostEmbed())
            data.dailyStreak = 0
        }
        data.messageSent = false
        Database.updateUser(id, data)
    }
    
    private reminderEmbed() {
        return Messenger.createEmbed('Reminder from Grombo!', chooseComment('user_reminded'))
    }

    private streakLostEmbed() {
        return Messenger.createEmbed('You lost your streak!', chooseComment('streak_lost'))
    }

    public static isSameTime(moment: Moment, hour: number, minute: number) {
        return moment.hour() == hour && moment.minute() == minute && moment.second() == 0
    }
}