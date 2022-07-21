// Starts Spotify - Console integration.
// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-16

require("dotenv").config()
const chalk = require("chalk")

// Checks are done at this point with the main app.
// Tokens available and in process.env:
// SPOTIFY_ACCESS_API
// SPOTIFY_REFRESH_API

// File metadata.
module.exports._METADATA = {
    name: 'Console Integration',                            // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Prints out the data from the widgets',    // Short description of the module.
    requires_init: true,                                    // Whether or not this module requires the init function to be run.
    //requires_auth: true,                                    // Whether or not this module requires authentication.
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
}

module.exports._run =  async (string) => {
    console.log(string)

    return true
}