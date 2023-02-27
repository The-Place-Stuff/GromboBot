const express = require('express')
const server = express()

server.all('/', (req, res)=>{
    res.send('Your bot is alive!')
})

server.all('/stop', (req, res)=>{
    res.send('Stopped!')
    
    return process.abort()
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")})
}

module.exports = keepAlive