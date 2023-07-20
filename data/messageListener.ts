
import { Message } from 'discord.js'
import { Database } from './database'
import { Messenger } from './messenger'
import { chooseComment } from './fileUtils'

export class MessageListener {

    public async onSend(message: Message) {
        const author = message.author
        const user = Database.getUser(author.id)
        
        if (!user) return
        if (!user.posted) {
            user.posted = true
            user.streak++

            Messenger.sendDM(author, this.postCreatedEmbed(user.streak))
            console.log(`${author.username} has reached a streak of ${user.streak}}`)
        }
        Database.updateUser(author.id, user)
    }

    private postCreatedEmbed(streak: number) {
        return Messenger.createEmbed('You made a post!', `You've reached a streak of ${streak}! ${chooseComment('post_created')}`)
    }
}