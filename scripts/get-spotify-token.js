// Gets token from Spotify and saves it - starting a mini webserver to authenticate it.
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const fastify = require('fastify')()
const chalk = require('chalk')
const fs = require('fs')

const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI + process.env.SPOTIFY_REDIRECT_ROUTE
})


fastify.get(process.env.SPOTIFY_REDIRECT_ROUTE, async (request, reply) => {
    console.log("Received request to authorize.")
    SpotifyApi.authorizationCodeGrant(request.query.code).then(async (data) => {
        let accesstoken = data.body["access_token"]
        let refreshtoken = data.body["refresh_token"]

        if (accesstoken == (undefined||"")) { // Check if accesstoken returned, as refreshtoken would be valid
            console.error(chalk.bgRed.white("No token recieved. This shouldn't happen - therefore please retry, or start an issue!"))
            process.exit(1)
        }
        console.log("Token authorized.")
        console.log("Writing to file...")
        await fs.writeFileSync("./tokens/SPOTIFY_TOKEN", `${accesstoken}|${refreshtoken}|${Date.now()}`)
        await reply.send("<script> window.close() </script>")
        console.log(chalk.bgGreen("Token written to file."))
        process.exit(1)
    })
})

// Starts the server
const start = async () => {
    try {
        console.log("Please authorize.")
        console.log(SpotifyApi.createAuthorizeURL(["user-read-currently-playing"]))
        await fastify.listen({ port: process.env.SPOTIFY_OAUTH_PORT })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
start()