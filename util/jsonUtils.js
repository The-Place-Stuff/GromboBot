const fs = require('fs')
const path = require("path")

function writeJsonFile(filePath, name, data) {
    return fs.writeFileSync(path.join(process.cwd(), `${filePath}/${name}.json`), JSON.stringify(data, null, 4))
}

function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), filePath + '.json')))
    } catch {
        return false
    }
}

function selectComment(type) {
    const comments = readJsonFile(`data/${file}.json`)

    const nextIntBetween = (min = 0, max = 0) => {
        return Math.floor(Math.random() * (max - min) + min)
    }
    return comments[nextIntBetween(0, comments.length - 1)]
}

function readFile(filePath) {
    try {
        return fs.readFileSync(path.join(process.cwd(), filePath))
    } catch {
        return false
    }
}

function readDir(filePath) {
    return fs.readdirSync(path.join(process.cwd(), filePath))
}

module.exports = {
    writeJsonFile,
    readJsonFile,
    readFile,
    readDir,
    selectComment
}