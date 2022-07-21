// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-18

require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const input = require("input")

// Checks are done at this point with the main app.
// Tokens available and in process.env:


// File metadata.
module.exports._METADATA = {
    name: 'Telegram Integration',                            // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Integrates into telegram.org',    // Short description of the module.
    requires_init: true,                                    // Whether or not this module requires the init function to be run.
    requires_auth: true,                                    // Whether or not this module requires authentication.
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
    if (!(process.env.TEST_STAGE == this._METADATA.requireTestStage)) {
        return false, `This module can only be used in TEST_STAGE ${this._METADATA.requireTestStage}.`
    }
    try {
        const gram = require("telegram")
        try {   
            const session = new gram.sessions.StringSession(fs.readFileSync("./tokens/TELEGRAM_TOKEN"))
            
        } catch { // A previous session hasn't been saved.
            const session = new gram.sessions.StringSession("")
        }
        const Telegram = new gram.TelegramClient(session, process.env.TELEGRAM_APP_ID, process.env.TELEGRAM_APP_HASH)
        await Telegram.start({
            phoneNumber: async () => await input.text("Please enter your phone number > "),
            password: async () => await input.text("Please enter your 2FA password > "),
            phoneCode: async () => await input.text("Please enter the code you recieved >"),
            onError: async (err) => {throw err}
        })
        await fs.writeFile("./tokens/TELEGRAM_TOKEN",client.session.save())
        console.log("Authenticated")
    } catch (err) { // Means the module isn't installed - prompt for installation
        console.log(err)
        return false, `This module requires optional dependencies. Run npm i --install-optional`
    }
    return true
}

module.exports._run =  async (string) => {
    console.log(string)

    return true
}