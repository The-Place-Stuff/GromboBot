import { Message } from 'discord.js'
import { Database } from './database'
import { Messenger } from './messenger'
import { chooseComment } from './fileUtils'

export class MessageListener {

    public async onSend(message: Message) {
        const author = message.author
        const user = Database.getUser(author.id)
        
        if (!user) return
        if (!user.messageSent) {
            user.messageSent = true
            user.dailyStreak++
            user.coins += 100

            Messenger.sendDM(author, this.postCreatedEmbed(user.dailyStreak))
            console.log(`${author.username} has reached a streak of ${user.dailyStreak}}`)
        }
        Database.updateUser(author.id, user)
    }

    private postCreatedEmbed(streak: number) {
        return Messenger.createEmbed('You made a post!', `You've reached a streak of ${streak}! ${chooseComment('post_created')}`)
    }
}