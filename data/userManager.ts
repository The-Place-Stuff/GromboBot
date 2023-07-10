import { User } from '../types/types';
import { read, write, readDir } from './fileUtils'

export class UserManager {
    
    public static createUser(id: string, reminder: boolean): User {
        const data: User = {
            streak: 0,
            posted: false,
            reminder: reminder
        }
        write(`db/${id}.json`, JSON.stringify(data, null, 4))
        return JSON.parse(read(`db/${id}.json`)) as User
    }

    public static getUser(id: string): User | undefined {
        const user: User = JSON.parse(read(`db/${id}.json`))
        if (!user) return undefined
        return user
    }

    public static updateUser(id: string, user: User) {
        write(`db/${id}.json`, JSON.stringify(user, null, 4))
    }

    public static getDatabase(): Map<string, User> {
        const files = readDir('db/')
        const database: Map<string, User> = new Map()

        for (const file of files) {
            const id = file.split('.json')[0]
            const user = this.getUser(id)

            if (!user) continue
            database.set(id, user)
        }
        return database
    }
}

