//Logging stuffs

//log info
const info = (...params) => {
    console.log(...params)
}

//log error
const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}