const express = require('express')
const server = express()

server.all('/', (req, res) => {
    res.send('Grombo remains alive!')
})

server.all('/stop', (req, res) => {
    res.send('Grombo has died!')
    return process.abort()
})

function keepAlive() {
    server.listen(3000, () => { console.log('Server is ready!') })
}

module.exports = keepAlive