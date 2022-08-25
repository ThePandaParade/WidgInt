# Plugin Development

## This relates to developing plugins, i.e apps/widgets. For installing plugins, please see the Install Plugins section.

## Terms of Service

- Don't restrict plugins behind a paywall.
- Don't create plugins that break another app's ToS without a warning in the README.

## Documentation

### _METADATA

Required. It must be an Object. All values listed should be a string, boolean, or number.

#### name

The plguin name. This is used for selection and identification internally.

#### maintainer

The plugin's maintainer. Must be a valid GitHub username.

#### description

Currently unused.

#### requires_init

Whether the function requires initalizing after loading. This should be used to check compatibility, checking authorization tokens and anything else. 

#### deprecated

Currently unused.

#### supportedVersion

Currently unused.

#### type

Currently unused.

### _init()

Optional. If present and requires_init is true, this will run during the plugin loading process.

### _run(string)

Required. This will run with every loop. For widgets, no arguments will be passed, however the result must be returned. For apps, the final string from all widgets will be passed as an Array, and afterwards the app must return true. This is used for error checking.

### _unload()

Currently unused. 