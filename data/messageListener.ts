import { Message, MessageCreateOptions, User } from 'discord.js'
import { UserManager } from './userManager'

export class MessageListener {

    public async onSend(message: Message) {
        const author = message.author
        const user = UserManager.getUser(author.id)
        
        if (!user) return
        if (!user.posted) {
            user.posted = true
            user.streak++

            MessageListener.sendDialogue(author, 'You posted something today!')
            console.log(`${author.username} has reached a streak of ${user.streak}}`)
        }
        UserManager.updateUser(author.id, user)
    }

    public static async sendDialogue(user: User, message: string) {
        const options: MessageCreateOptions = {
            embeds: [
                { title: 'Grombo', description: message, thumbnail: {url: 'https://cdn.discordapp.com/attachments/764283096803311636/1078858187102498928/Untitled465.png'}}
            ]
        } 
        try {
            await user.send(options)
        } catch (error) {
            console.warn(error)
        }
    }
}