"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TasteeCore {
    constructor(analyser) {
        this._engineInitialized = false;
        this.analyser = analyser;
    }
    init(engine) {
        this.engine = engine;
        this.analyser.init();
        this._engineInitialized = true;
    }
    addPluginFile(filePath, onFileAdded) {
        this.analyser.addPluginFile(filePath, onFileAdded);
    }
    addParamFile(filePath) {
        this.analyser.addParamFile(filePath);
    }
    stop() {
        if (this._engineInitialized) {
            this.engine.stop();
            this._engineInitialized = false;
        }
    }
    execute(tasteeCode, tasteeFileName) {
        return this.executeLines(tasteeCode.split('\n'), tasteeFileName);
    }
    executeLines(tasteeCode, tasteeFileName) {
        var jsCode = this.analyser.toJsCode(tasteeCode);
        return this.engine.execute(jsCode, tasteeFileName);
    }
}
exports.TasteeCore = TasteeCore;

//# sourceMappingURL=tastee-core.js.map
