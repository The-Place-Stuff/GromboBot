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