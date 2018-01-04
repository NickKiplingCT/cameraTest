var LogManager = (function () {
    function LogManager() {
        console.log("::initialise::  Starting application. Log Manager 0.0.1");
    }
	
	LogManager.prototype.consoleLog = function (message, type) {
        // Scope in cti
        var cti = window.cti

        // Set our debug flags from the schemea
        var logDebug = cti.store.schema.metadata.logDebug
        var startDebug = cti.store.schema.metadata.startDebug

        // If logDebug is "true" then console.log message parameter
	    if(logDebug === "true") {
            if(type === undefined) {
                type = 'debug'
            }

            console.log('::' + type + ':: ' + message)
        }

        // If startDebug is "true" then hit a debug point to break into
        // function flow
        if(startDebug === "true") {
            debugger;
        }

        return true
	}

    return LogManager;
}());

function startLogManager() {
    console.log("::initialise::  Starting logManager");
	
	window.logManager = new LogManager();
}

if (!window.device) {
    console.log("::initialise::  No device, manually start logManager");
    window.setTimeout(function () {
		startLogManager();
    }, 500);
}

document.removeEventListener('deviceready', startLogManager);
document.addEventListener('deviceready', startLogManager, true);
