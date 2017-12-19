"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TasteeCore {
    constructor(analyser) {
        this.analyser = analyser;
    }
    init(engine) {
        this.engine = engine;
        this.analyser.init();
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
        var seleniumCode = this.analyser.toSeleniumCode(tasteeCode);
        return this.engine.execute(seleniumCode, tasteeFileName);
    }
}
exports.TasteeCore = TasteeCore;

//# sourceMappingURL=tastee-core.js.map
