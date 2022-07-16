// index.js
// Where it begins is where it shall end - some historical figure.
// This is the main file for the application.
// Frankly, should go without saying, if you don't know what you're doing, don't touch this file.

// Imports.
require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const promptchoices = require("prompt-choices")

// Internal variables.
let loadedApps = []
let loadedWidgets = []

// Internal functions

function debugLog(message) {
    if (process.env.DEBUG == "true") {
        console.log(chalk.yellow(message))
    }
}

function pluginCheck(plugin) {
    if (plugin.endsWith(".js") && process.env.MODULAR) {
        try {
            let pluginPath = path.join(__dirname, "plugins/apps", plugin)
            let pluginModule = require(pluginPath)
            if (!(pluginModule._METADATA && pluginModule._run)) { // Check if the plugin is valid.
                throw new Error("Plugin is missing metadata or run function.")
            }
            if (!(pluginModule._METADATA.requires_init && pluginModule._init)) { // Check if the plugin is valid.
                throw new Error("Plugin's METADATA says _init is required, however none is provided.")
            }

            if (pluginModule._METADATA.type == 1) { // If the plugin is an app.
                loadedApps.push(pluginModule)
            } else if (pluginModule._METADATA.type == 2) { // If the plugin is a widget.
                loadedWidgets.push(pluginModule)
            } else if (pluginModule._METADATA.type == 3) { // If the plugin is an expansion.
                throw new Error("Expansions are not yet supported.")
            } else {
                throw new Error("Plugin's METADATA has an invalid type.")
            }
            debugLog(`Loaded plugin ${plugin}`)
        }
        catch (err) {
            console.log(chalk.red(`Failed to load plugin ${plugin}.`))
            debugLog(err)
        }
    }
}

// Now the real fun!
// Loads all plugins. Does not run if MODULAR is false.

const rawApps = fs.readdirSync(path.join(__dirname, "plugins/apps"))
const rawWidgets = fs.readdirSync(path.join(__dirname, "plugins/widgets"))

rawApps.forEach(plugin => pluginCheck(plugin))
rawWidgets.forEach(plugin => pluginCheck(plugin))

if ((loadedApps.length == 0 || loadedWidgets.length == 0) && process.env.MODULAR) {
    console.log(chalk.bgRed.white("Not enough plugins were able to be loaded. Requires 1 app and 1 widget."))
    debugLog(`Plugins loaded: ${loadedApps.length} apps, ${loadedWidgets.length} widgets.`)
    process.exit(1)
}

