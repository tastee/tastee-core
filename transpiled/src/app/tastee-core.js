"use strict";
var TasteeCore = (function () {
    function TasteeCore(analyser, onAnalyserReady) {
        this.analyser = analyser;
        this.analyser.addPluginFile('./plugin/common-instructions.conf.tee', onAnalyserReady);
    }
    TasteeCore.prototype.init = function (engine) {
        this.engine = engine;
    };
    TasteeCore.prototype.addPluginFile = function (filePath, onFileAdded) {
        this.analyser.addPluginFile(filePath, onFileAdded);
    };
    TasteeCore.prototype.addParamFile = function (filePath) {
        this.analyser.addParamFile(filePath);
    };
    TasteeCore.prototype.stop = function () {
        this.engine.stop();
    };
    TasteeCore.prototype.execute = function (tasteeCode, tasteeFileName) {
        try {
            var seleniumCode = this.analyser.toSeleniumCode(tasteeCode.split('\n'));
            return this.engine.execute(seleniumCode, tasteeFileName);
        }
        catch (exception) {
            console.error(exception.message);
        }
    };
    return TasteeCore;
}());
exports.TasteeCore = TasteeCore;

//# sourceMappingURL=tastee-core.js.map
