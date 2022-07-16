// Test File
// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-16

require("dotenv").config()

// Checks are done at this point with the main app.
// Tokens available and in process.env:
// SPOTIFY_ACCESS_API
// SPOTIFY_REFRESH_API

// File metadata.
module.exports._METADATA = {
    name: 'Test Widget',                                    // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Prints out the data from the widgets',    // Short description of the module.
    requires_init: true,                                    // Whether or not this module requires the init function to be run.
    requires_auth: true,                                    // Whether or not this module requires authentication.
    already_looping: false,                                 // Whether this module handles looping by itself.
    loop_interval: 60,                                      // The interval at which the module should loop. Unrequired if already_looping is true.
    deprecated: false,                                      // If true, the module will be removed from the app.
    requireTestStage: 2,                                    // Should be set to 2.
    widgetsRequired: [""],                                  // Array of widgets that this module requires.
    supportedVersion: "0.0.1"                               // The version of the app that this module was built with.
}

module.exports._init = async () => {
    if (!(process.env.TEST_STAGE == 2)) {
        return false, "fatal", "This module can only be used in TEST_STAGE 2."
    }
}

module.exports._run =  async () => {
    let final = "This is a test widget."

    return true, final
}