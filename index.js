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
/* 
loadedApps.map((x) => {return {name: x._METADATA.name, type: "choice"}})
loadedWidgets.map((x) => {return {name: x._METADATA.name, type: "choice"}})

(async () => {
    let inq = inquirer.prompt([{
        type: "checkbox",
        name: "appprompt",
        message: "Choose what to enable: ",
        choices: choices
    }])
    inq.appprompt.forEach(answer => {
        if (loadedApps.find(a => a._METADATA.name == answer)) {
           selectedApps.push(loadedApps.find(a => a._METADATA.name == answer))
           debugLog(`App ${answer} loaded.`)
        }
        else {
            selectedWidgets.push(loadedWidgets.find(w => w._METADATA.name == answer))
            debugLog(`Widget ${answer} loaded`)
        }
    })

    process.env.TEST_STAGE = 2
})()
.then(async () => {
    // If the user didn't select enough apps and widgets, exit out.
    if (selectedApps.length == 0 && selectedWidgets.length == 0) {
        console.log(chalk.bgRed.white("Not enough apps or widgets were selected. Requires 1 app and 1 widget."))
        process.exit(1)
    }
})
 */
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
           await app._init()
           debugLog(`App ${answer} loaded.`)
        }
        else {
            var widget = loadedWidgets.find(w => w._METADATA.name == answer)
            selectedWidgets.push(widget)
            debugLog(`Widget ${answer} loaded`)
        }
    })
})

// Go through all loaded items to see if they require init

// Init all apps 
selectedApps.forEach(async (app) => {
    console.log(chalk.green(`Initializing app ${app._METADATA.name}`))
        try {
            const retW = await app._init()
            if (retW[0] == false) {
                console.warn(`${app._METADATA.name} failed to init. Unloading...`)
                debugLog(retW[1])
                // Unload the app
                selectedApps.splice(selectedApps.indexOf(app), 1)
            }
        } catch (err) {
            console.warn(`${app._METADATA.name} failed to init. Unloading...`)
            debugLog(err)
            // Unload the app
            selectedApps.splice(selectedApps.indexOf(app), 1)

        }
})

selectedWidgets.forEach(async (widget) => {
    try {
        const retW = await widget._init()
        if (retW[0] == false) {
            console.warn(`${widget._METADATA.name} failed to init. Unloading...`)
            debugLog(retW[1])
            // Unload the app
            selectedWidgets.splice(selectedWidgets.indexOf(app), 1)
        }
    } catch (err) {
        console.warn(`${widget._METADATA.name} failed to init. Unloading...`)
        debugLog(err)
        // Unload the app
        selectedWidgets.splice(selectedApps.indexOf(app), 1)
    }
})

// Add handling for Ctrl + C
process.on("SIGINT", async () => {
    console.log(chalk.red("Shutting down..."))
    // Until an unload functionality is added, force quit.
    process.exit(-1)
})

// Now we start the main loop...

let final = []

console.log(chalk.green("[Index]") + "Main loop started.")
setInterval( async () => {
    //final = [];
    // Cuz for some reason clearing the variable up here causes .push to fail 🤷🤷

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

/*     if (suffix) { //Append the suffix.
        final.push(suffix)
    } */
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

    final = []
}, 6000)