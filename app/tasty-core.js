"use strict";

var engine = require("./tasty-engine");
var analyser = require("./tasty-analyser");

module.exports = {
    //initialise common instruction once for all
    loadAnalyser(onAnalyserReady){
        analyser.addPluginFile("./plugin/common-instructions.conf.tty", onAnalyserReady);
    },
    addPluginFile (filePath) {
        analyser.addPluginFile(filePath);
    },
    addParamFile (filePath) {
        analyser.addParamFile(filePath);
    },
    init(browser) {
        engine.init(browser);
    },
    stop() {
        engine.stop();
    },
    execute(tastyCode) {
        try {
            var seleniumCode = analyser.toSeleniumCode(tastyCode.split("\n"));
            
            engine.execute(seleniumCode);
        }
        catch (exception) {
            console.error(exception.message);
        }
    }
};