

function getCurrentTime() {
    return new Date().getTime()
}

function getResetTime() {
    const now = new Date()
    return new Date(`${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()} 03:00:00 GMT-0500`).getTime()
}

module.exports = {
    getCurrentTime,
    getResetTime
}