import { Instruction } from './instruction';
import { TasteeEngine } from './tastee-engine';
import { TasteeAnalyser } from './tastee-analyser';
require('geckodriver');
require('chromedriver');
export class TasteeCore {

    analyser: TasteeAnalyser;
    engine: TasteeEngine;

    constructor(analyser: TasteeAnalyser) {
        this.analyser = analyser;
    }

    init(engine: TasteeEngine): void {
        this.engine = engine;
        this.analyser.init();
    }

    addPluginFile(filePath: string, onFileAdded?: () => void): void {
        this.analyser.addPluginFile(filePath, onFileAdded);
    }

    addParamFile(filePath: string): void {
        this.analyser.addParamFile(filePath);
    }

    stop(): void {
        this.engine.stop();
    }

    execute(tasteeCode: string, tasteeFileName?: string): Promise<Instruction[]> {
        return this.executeLines(tasteeCode.split('\n'), tasteeFileName);
    }

    executeLines(tasteeCode: string[], tasteeFileName?: string): Promise<Instruction[]> {
        var seleniumCode = this.analyser.toSeleniumCode(tasteeCode);
        return this.engine.execute(seleniumCode, tasteeFileName);
    }
}

