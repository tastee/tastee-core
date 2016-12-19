"use strict";
var TasteeCore = (function () {
    function TasteeCore(engine, analyser) {
        this.analyser = analyser;
        this.engine = engine;
    }
    TasteeCore.prototype.init = function (onAnalyserReady) {
        this.analyser.addPluginFile('./plugin/common-instructions.conf.tee', onAnalyserReady);
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
