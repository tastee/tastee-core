"use strict";
var debug = require('debug')('core');

var engine = require("./tastee-engine");
var analyser = require("./tastee-analyser");

module.exports = {
    //initialise common instruction once for all
    loadAnalyser(onAnalyserReady) {
        analyser.addPluginFile("./plugin/common-instructions.conf.tee", onAnalyserReady);
    },
    addPluginFile(filePath) {
        analyser.addPluginFile(filePath);
    },
    addParamFile(filePath) {
        analyser.addParamFile(filePath);
    },
    init(browser, screenshotpath) {
        engine.init(browser, screenshotpath);
    },
    stop() {
        engine.stop();
    },
    execute(tasteeCode) {
        try {
            var seleniumCode = analyser.toSeleniumCode(tasteeCode.split("\n"));
            return engine.execute(seleniumCode);
        }
        catch (exception) {
            debug('an escption have been thrown : %s', exception )
            console.error(exception.message);
        }
    }
};
