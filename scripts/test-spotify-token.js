// Tests the currently loaded Spotify token
require("dotenv").config()
const Spotify = require("spotify-web-api-node")
const fs = require("fs")
const chalk = require("chalk")

let pass = 0
let warn = 0
let fatal = 0


if(!(fs.readFileSync("./tokens/SPOTIFY_TOKEN")) && !process.env.SPOTIFY_TOKEN) {
    console.log(chalk.bgYellow.white("[WARNING] No Spotify token found. Please run 'npm run get-spotify-token' to get a token."))
    warn += 1
}
else {
    console.log(chalk.bgGreen.white("[PASS] Spotify token found."))
    pass += 1
}

if(!process.env.SPOTIFY_CLIENT_ID) {
    console.log(chalk.bgRed.white("[FATAL] No Spotify client ID found. Please set the SPOTIFY_CLIENT_ID environment variable."))
    fatal += 1
}
else {
    console.log(chalk.bgGreen.white("[PASS] Spotify client ID found."))
    pass += 1
}

if(!process.env.SPOTIFY_CLIENT_SECRET) {
    console.log(chalk.bgRed.white("[FATAL] No Spotify client secret found. Please set the SPOTIFY_CLIENT_SECRET environment variable."))
    fatal += 1
}
else {
    console.log(chalk.bgGreen.white("[PASS] Spotify client secret found."))
    pass += 1
}

if(!process.env.SPOTIFY_OAUTH_PORT) {
    console.log(chalk.bgRed.white("[FATAL] No Spotify OAuth port found. Please set the SPOTIFY_OAUTH_PORT environment variable."))
    fatal += 1
}
else {
    console.log(chalk.bgGreen.white("[PASS] Spotify OAuth port found."))
    pass += 1
}

if(!process.env.SPOTIFY_REDIRECT_URI) {
    console.log(chalk.bgRed.white("[FATAL] No Spotify redirect URI found. Please set the SPOTIFY_REDIRECT_URI environment variable."))
    fatal += 1
}
else {
    console.log(chalk.bgGreen.white("[PASS] Spotify redirect URI found."))
    pass += 1
}

console.log("----------------------------------------------------")
console.log(chalk.bgGreen.white("[PASS] ") + pass + " tests passed.")
console.log(chalk.bgYellow.white("[WARNING] ") + warn + " tests warned.")
console.log(chalk.bgRed.white("[FATAL] ") + fatal + " tests failed.")
console.log("----------------------------------------------------")
