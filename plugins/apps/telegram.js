// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-18

require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const input = require("input")
let has_init = false
let Telegram;

try {
    var gram = require("telegram")
}
catch {
    console.log(chalk.red("[Telegram]") + " Optional dependencies are not installed. Please run npm i")
}

// Checks are done at this point with the main app.
// Tokens available and in process.env:


// File metadata.
module.exports._METADATA = {
    name: 'Telegram Integration',                            // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Integrates into telegram.org',    // Short description of the module.
    requires_init: true,                                    // Whether or not this module requires the init function to be run.
    deprecated: false,                                      // If true, the module will be removed from the app.
    requireTestStage: 2,                                    // Should be set to 2.
    supportedVersion: "0.0.1",                              // The version of the app that this module was built with.

    // Required data for widget formatting.
    maxStringLength: 0,                                     // The maximum available length for the string. 0 for no limit.
    preformat: true,                                        // Whether or not the string should be preformatted. Will cause the app to pass an array if false.

    // Metadata for identification internally.
    type: 1,                                                // 1 for app, 2 for widget, 3 for expansion.
}

module.exports._init = async () => {
    try {
        require("telegram") // Check if they have gram installed.
    }
    catch {
        console.log(chalk.red("[Telegram]") + " Optional dependencies are not installed. Please run npm i --")
    }
    // Check if the token exists
    if (await fs.existsSync("./tokens/TELEGRAM_TOKEN")) {
        return true
    } else {
        console.error(chalk.red("[Telegram]") + " No token found. Please run npm run get-telegram-token to get a token.")
        process.exit(1)
    }
    return true
}

async function preRun() {
    session = new gram.sessions.StringSession(await fs.readFileSync("./tokens/TELEGRAM_TOKEN").toString())    
    Telegram = new gram.TelegramClient(session, Number(process.env.TELEGRAM_APP_ID), process.env.TELEGRAM_APP_HASH)
    Telegram.setLogLevel("none")
    await Telegram.connect()
    has_init = true
}

module.exports._run =  async (string) => {
    if (!has_init) {
        await preRun()
    }

    const api = gram.Api

    // Check if the user has premium (for double bio limit.)
    if (await fs.existsSync("./tokens/TELEGRAM_PREMIUM_TOKEN")) { var premium = true } else { var premium = false }

    // Truncate the string if its too long for Telegram's bio limit.
    if (string.length > 70 && !premium) { string = string.substring(0,70) } 
    else if (string.length > 140 && premium) { string = string.substring(0,140) } // Yeah fuck whoever decided double bio was a paywall feature.

    if (process.env.TEST_MODE == "true") {
        // Test mode is enabled: don't update the actual bio.
        console.log(chalk.yellow("[Telegram]") + " Test mode is on. Skipping bio changes.")
        console.log(chalk.yellow("[Telegram]") + " Result: " + chalk.blue(string))
        return true
    }
    else {
        // Test mode is disabled: update the actual bio.
        await Telegram.invoke(new api.account.UpdateStatus({offline: true})) // Don't update the online presence.
        await Telegram.invoke(new api.account.UpdateProfile({about: string}))
        return true
    }
}