// index.js
// Where it begins is where it shall end - some historical figure.
// This is the main file for the application.
// Frankly, should go without saying, if you don't know what you're doing, don't touch this file.

// Imports.
require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const prompt = require("prompt-checkbox")

// Internal variables.
let loadedApps = []
let loadedWidgets = []

// Internal functions

function debugLog(message) {
    if (process.env.DEBUG == "true") {
        console.log(chalk.yellow(message))
    }
}

function pluginCheck(plugin,type) {
    if (plugin.endsWith(".js") && process.env.MODULAR) {
        try {
            let pluginPath = path.join(__dirname, `plugins/${type}`, plugin)
            let pluginModule = require(pluginPath)
            if (!(pluginModule._METADATA && pluginModule._run)) { // Check if the plugin is valid.
                throw new Error("Plugin is missing metadata or run function.")
            }
            if ((pluginModule._METADATA.requires_init == true && !pluginModule._init)) { // Check if the plugin is valid.
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

async function mainLoop() {
    selectedWidgets.forEach(async (widget) => {
        try {
            const ret = await widget._run();
            final.push(ret);
            debugLog(`Widget ${widget._METADATA.name} returned ${ret}`)
        } catch (err){
            console.log(chalk.bgRed.white(`Widget ${widget._METADATA.name} failed to run.`))
            debugLog(err)
        }
    });

    // Now the widgets have sent their data our way - we send data to the apps.
    selectedApps.forEach(async (app) => {
        try {
            if (app._METADATA.preformat) {
                final = final.join(" || ")
            }
            if (app._METADATA.maxStringLength > final.length && app._METADATA.maxStringLength > 0) { // If the string is too long, truncate it.
                final = final.substring(0, app._METADATA.maxStringLength)
                debugLog(`String for app ${app._METADATA.name} was too long. Truncated to ${final}`)
            }
        } catch {} // Fail silently, app was set not to preformat.
        const ret = await app._run(final)
        if (ret == true) { // This app succeeded.
            debugLog(`App ${app._METADATA.name} returned ${ret[0]}`)
        }
        else {
            debugLog(`App ${app._METADATA.name} failed to run.`)
        }
    })

    final = [];
}

// Now the real fun!
// Loads all plugins. Does not run if MODULAR is false.

const rawApps = fs.readdirSync(path.join(__dirname, "plugins/apps"))
const rawWidgets = fs.readdirSync(path.join(__dirname, "plugins/widgets"))

rawApps.forEach(plugin => pluginCheck(plugin,"apps"))
rawWidgets.forEach(plugin => pluginCheck(plugin,"widgets"))

// If no plugins could load, abort.
// Will be bypassed if MODULAR is false.

if ((loadedApps.length == 0 || loadedWidgets.length == 0) && process.env.MODULAR) {
    console.log(chalk.bgRed.white("Not enough plugins were able to be loaded. Requires 1 app and 1 widget."))
    process.exit(1)
}

debugLog(`Plugins loaded: ${loadedApps.length} apps, ${loadedWidgets.length} widgets.`)

// Selection

const selectedApps = []
const selectedWidgets = []

var appprompt = new prompt({
    name: "appprompt",
    message: "Choose what to enable: ",
    radio: true,
    choices: {
        apps: loadedApps.map((x) => {return x._METADATA.name}),
        widgets: loadedWidgets.map((x) => {return x._METADATA.name})
    }
})

appprompt.run()
.then(answers => {
    answers.forEach(async (answer) => {
        if (loadedApps.find(a => a._METADATA.name == answer)) {
           var app = loadedApps.find(a => a._METADATA.name == answer)
           selectedApps.push(app)
           if (app._METADATA.requires_init) {
                await app._init()
           }
           debugLog(`App ${answer} loaded.`)
        }
        else {
            var widget = loadedWidgets.find(w => w._METADATA.name == answer)
            selectedWidgets.push(widget)
            if (widget._METADATA.requires_init) {
                await widget._init()
            }
            debugLog(`Widget ${answer} loaded`)
        }
    })
})

// Now we start the main loop...

let final = []

console.log(chalk.green("[Index]") + " Main loop started.");

// Run it once, leave setInterval to do the rest.
mainLoop()
setInterval(mainLoop, Number(process.env.LOOP_HALT) * 1000)