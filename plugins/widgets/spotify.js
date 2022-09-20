// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-16

require("dotenv").config()
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require("fs")
const chalk = require("chalk")
let has_init = false
let spotify;

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

// File metadata.
module.exports._METADATA = {
    name: 'Spotify Now Playing',                                    // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Displays the currently playing song.',    // Short description of the module.
    requires_init: true,                                    // Whether or not this module requires the init function to be run.
    deprecated: false,                                      // If true, the module will be removed from the app.
    supportedVersion: "0.0.1",                              // The version of the app that this module was built with.

    // Metadata for identification internally.
    type: 2,                                                // 1 for app, 2 for widget, 3 for expansion.
}

module.exports._init = async function () {
    try {
        require("spotify-web-api-node")
    } catch {
        console.log(chalk.red("[Spotify]") + " Optional dependencies are not installed. Please install it to use this module.")
    }
    if (await fs.existsSync("./tokens/SPOTIFY_TOKEN")) {
        return true
    } else {
        console.log(chalk.red("[Spotify]") + " No Spotify token found. Please run the Spotify module to get one.")
        return false
    }
}

async function preRun() {
    spotify = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI + process.env.SPOTIFY_REDIRECT_ROUTE
    })
    const tokenFile = await fs.readFileSync("./tokens/SPOTIFY_TOKEN")
    spotify.setAccessToken(tokenFile.toString().split("|")[0])
    spotify.setRefreshToken(tokenFile.toString().split("|")[1])
    return spotify
}

module.exports._run = async function () {
    if (!has_init) {
        has_init = true
        await preRun()
    }
    let final = ""

    const track = await spotify.getMyCurrentPlayingTrack()
    // Nothing is playing right now
    if (track.body == null||track.body.item == undefined) {
        final = "⏯️ Not Playing Anything."
    } else {
        const progressFormatted = fmtMSS(~~(track.body.progress_ms / 1000))
        const durationFormatted = fmtMSS(~~(track.body.item.duration_ms / 1000))

        final = `⏯️ ${track.body.item.artists[0].name} - ${track.body.item.name}  (${progressFormatted} - ${durationFormatted})`
    }

    // Refresh the access token, as its length is unditermined.
    spotify.refreshAccessToken((err, data) => {
        if (err) {
            console.log(chalk.red("[Spotify]") + " Error refreshing access token: " + err)
        } else {
            spotify.setAccessToken(data.body.access_token)
        }
    })
    // Then pass it.
    return final
}