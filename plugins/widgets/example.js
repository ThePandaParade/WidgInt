// Example Widget
// This file is more documentated, use this if you want to add your own widgets / apps!

require("dotenv").config() // Loads the .env file.

// File metadata. Used for naming and maintainer status.
module.exports._METADATA = {
    name: 'Test Widget',                                    // Name of the module. Will be showed in the console.
    maintainer: '@WhenDawnEnds',                            // @username
    description: 'Returns a string.',                       // Short description of the module.
    requires_init: false,                                    // Whether or not this module requires the init function to be run. ._init() must NOT be defined if false!
    deprecated: false,                                      // If true, the module will be displayed with a warning before loading.
    supportedVersion: "0.0.1",                              // The version of the app that this module was built with.

    // Metadata for identification internally.
    type: 2,                                                // 1 for app, 2 for widget, 3 for expansion.
}

/* module.exports._init = async function () { // If you want to use the init for a widget/app, make sure requires_init is set to true in the metadata!
    return true
} */

module.exports._run = async function () { // This runs the code on every loop. Always return the final string.
    let final = "This is a test widget."

    return final
}