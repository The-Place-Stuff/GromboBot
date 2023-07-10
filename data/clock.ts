import { tz } from 'moment-timezone'
import { UserManager } from './userManager'
import { MessageListener } from './messageListener'
import { Client } from 'discord.js'

export class Clock {
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public async update() {
        const now = tz('America/New_York')

        for (const [id, user] of UserManager.getDatabase()) {
            const discordUser = await this.client.users.fetch(id)
            if (now.hours() === 5 && now.minutes() === 0 && now.seconds() === 0) {
                await MessageListener.sendDialogue(discordUser, 'reminder')
            }
            if (now.hours() === 6 && now.minutes() === 0 && now.seconds() === 0) {
                if (!user.posted) {
                    user.streak = 0
                    await MessageListener.sendDialogue(discordUser, 'streak no more')
                    console.log(`${discordUser.username} lost their streak!`)
                }
                user.posted = false
            }
        }
    }
}