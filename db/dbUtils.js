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
    readDir
}