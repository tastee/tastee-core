"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TasteeCore {
    constructor(analyser) {
        this.analyser = analyser;
    }
    init(engine) {
        this.engine = engine;
    }
    addPluginFile(filePath, onFileAdded) {
        this.analyser.addPluginFile(filePath, onFileAdded);
    }
    addParamFile(filePath) {
        this.analyser.addParamFile(filePath);
    }
    stop() {
        this.engine.stop();
    }
    execute(tasteeCode, tasteeFileName) {
        return this.executeLines(tasteeCode.split('\n'), tasteeFileName);
    }
    executeLines(tasteeCode, tasteeFileName) {
        try {
            var seleniumCode = this.analyser.toSeleniumCode(tasteeCode);
            return this.engine.execute(seleniumCode, tasteeFileName);
        }
        catch (exception) {
            console.error(exception.message);
        }
    }
}
exports.TasteeCore = TasteeCore;

//# sourceMappingURL=tastee-core.js.map
