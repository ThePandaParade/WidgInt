// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-18

require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const input = require("input")
let has_init = false

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
    preformat: false,                                        // Whether or not the string should be preformatted. Will cause the app to pass an array if false.

    // Metadata for identification internally.
    type: 1,                                                // 1 for app, 2 for widget, 3 for expansion.
}

module.exports._init = async () => {
    var gram = require("telegram")
    try {
        session = new gram.sessions.StringSession(await fs.readFileSync("./tokens/TELEGRAM_TOKEN").toString())    
    } catch(err) { // A previous session hasn't been saved.
        console.log(err)
        process.exit(1) // No session
    }
    const Telegram = new gram.TelegramClient(session, Number(process.env.TELEGRAM_APP_ID), process.env.TELEGRAM_APP_HASH)
    await Telegram.connect()
    await fs.writeFileSync("./tokens/TELEGRAM_TOKEN",Telegram.session.save())
    console.log("Authenticated")
    return true
}

module.exports._run =  async (string) => {
    if (!has_init) {
        await this._init() //Init is currently broken; so do it locally!
        has_init = true
    }

    // Go from array to string.
    string = string.join(" | ");

    // Check if the user has premium (for double bio limit.)
    if (await fs.existsSync("./tokens/TELEGRAM_PREMIUM_TOKEN")) { var premium = true } else { var premium = false }

    //  Truncate the string if its too long for Telegram's bio limit.
    if (string.length > 70 && !premium) {
        string = string.substring(0,70)
    } else if (string.length > 140 && premium) { string = string.substring(0,140) } // Yeah fuck whoever decided double bio was a paywall feature.

    if (process.env.TEST_MODE) {
        // Test mode is enabled: don't update the actual bio.
        console.log(chalk.yellow("[Telegram]") + " Test mode is on. Skipping bio changes.")
        console.log(chalk.yellow("[Telegram]") + " Result: " + chalk.blue(string))
        return true
    }
    else {
        // Test mode is disabled: update the actual bio.
        await Telegram.account.updateProfile({bio: string})
        return true
    }
}