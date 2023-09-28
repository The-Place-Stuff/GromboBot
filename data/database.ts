import { UserData } from '../types/types';
import { read, write, readDir } from './fileUtils'

export class Database {
    
    public static createUser(id: string, registered: boolean): void {
        const data: UserData = {
            dailyStreak: 0,
            coins: registered ? 500 : 0,
            messageSent: false,
            remindersEnabled: false
        }
        write(`db/${id}.json`, JSON.stringify(data, null, 4))
    }

    public static getUser(id: string): UserData | undefined {
        const file = read(`db/${id}.json`)
        if (!file) return undefined
        const user: UserData = JSON.parse(file)
        return user
    }

    public static getOrCreateUser(id: string): UserData {
        const user = Database.getUser(id)
        if (!user) {
            Database.createUser(id, false)
        }
        return Database.getUser(id)!
    }

    public static updateUser(id: string, user: UserData) {
        write(`db/${id}.json`, JSON.stringify(user, null, 4))
    }

    public static getUsers(): Map<string, UserData> {
        const files = readDir('db/')
        const database: Map<string, UserData> = new Map()

        for (const file of files) {
            const id = file.split('.json')[0]
            const user = this.getUser(id)

            if (!user) continue
            database.set(id, user)
        }
        return database
    }
}

