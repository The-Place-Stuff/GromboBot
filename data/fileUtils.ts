import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

export function write(path: string, content: string): void {
    writeFileSync(join(dirname(__dirname), path), content)
}

export function read(path: string): string | false {
    try {
        return readFileSync(join(dirname(__dirname), path), 'utf-8')
    }
    catch {
        return false
    }   
}

export function readDir(path: string): string[] {
    return readdirSync(join(dirname(__dirname), path))
}

export function chooseComment(type: string): string {
    const file = read(`data/assets/${type}.json`)
    if (!file) return 'COMMENT NOT FOUND'

    const data = JSON.parse(file) as string[]
    const randNumber = Math.floor(Math.random() * (data.length - 1))

    return data[randNumber]
}