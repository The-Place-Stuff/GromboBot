import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

export function write(path: string, content: string): void {
    writeFileSync(join(dirname(__dirname), path), content)
}

export function read(path: string): string {
    return readFileSync(join(dirname(__dirname), path), 'utf-8')
}

export function readDir(path: string): string[] {
    return readdirSync(join(dirname(__dirname), path))
}

export function chooseComment(type: string): string {
    const data = JSON.parse(read(`data/assets/${type}.json`)) as string[]
    const randNumber = Math.floor(Math.random() * (data.length - 1))

    return data[randNumber]
}