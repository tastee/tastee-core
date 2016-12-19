import {Instruction} from './instruction';
import {TasteeEngine} from './tastee-engine';
import {TasteeAnalyser} from './tastee-analyser';

export class TasteeCore {

    analyser:TasteeAnalyser;
    engine:TasteeEngine;

    constructor(engine:TasteeEngine, analyser:TasteeAnalyser) {
        this.analyser = analyser;
        this.engine = engine;
    }

    init(onAnalyserReady : () => void) : void {
        this.analyser.addPluginFile('./plugin/common-instructions.conf.tee', onAnalyserReady);
    }


    addPluginFile(filePath : string, onFileAdded : () => void) : void {
        this.analyser.addPluginFile(filePath, onFileAdded);
    }

    addParamFile(filePath : string) : void {
        this.analyser.addParamFile(filePath);
    }

    stop() : void {
        this.engine.stop();
    }

    execute(tasteeCode,tasteeFileName) : Promise<Instruction[]> {
        try {
            var seleniumCode = this.analyser.toSeleniumCode(tasteeCode.split('\n'));
            return this.engine.execute(seleniumCode,tasteeFileName);
        }
        catch (exception) {
            console.error(exception.message);
        }
    }
}

