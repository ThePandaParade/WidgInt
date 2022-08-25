// plugin_handler.js
// Handles installing, removing and updating plugins.
// Should go without saying, don't modify this unless you know what you're doing.

// Any functions with the _ prefix are used internally.

require("dotenv").config()
const chalk = require("chalk")
const fs = require("fs")
const path = require("path")

module.exports._pluginCheck = async function (plugin,type) {
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

            if (!(pluginModule._METADATA.type == 1 || pluginModule._METADATA.type == 2)) {
                return false, new Error("Plugin's METADATA has an invalid type.")
            }

            return plugin
        }
        catch (err) {
            console.log(chalk.red(`An error occured while checking plugin ${plugin}`))
            console.error(err)
        }
    }
    else {
        return undefined, "MODULAR is disabled."
    }
}