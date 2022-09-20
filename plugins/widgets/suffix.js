// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-16

require("dotenv").config()

// File metadata.
module.exports._METADATA = {
    name: 'Static Text',                                    // Name of the module.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Adds static text to the apps.',    // Short description of the module.
    requires_init: false,                                    // Whether or not this module requires the init function to be run.
    deprecated: false,                                      // If true, the module will be removed from the app.
    supportedVersion: "0.0.1",                              // The version of the app that this module was built with.

    // Metadata for identification internally.
    type: 2,                                                // 1 for app, 2 for widget, 3 for expansion.
}

module.exports._run = async function () {
    let final = "🙋 he/they || 🌐 https://pandapa.ws/"

    return final
}