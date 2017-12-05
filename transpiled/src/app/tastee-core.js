"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TasteeCore = /** @class */ (function () {
    function TasteeCore(analyser) {
        this.analyser = analyser;
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
        return this.executeLines(tasteeCode.split('\n'), tasteeFileName);
    };
    TasteeCore.prototype.executeLines = function (tasteeCode, tasteeFileName) {
        try {
            var seleniumCode = this.analyser.toSeleniumCode(tasteeCode);
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
