import * as fs from 'fs';
import {TasteeCode,TasteeCodeMatcher} from "./tastee-code";
import {Instruction} from "./instruction";


declare var propertiesReader: any;
var propertiesReader = require('properties-reader');
const yaml = require('js-yaml');

export class TasteeAnalyser {

    tasteeCodes:TasteeCode[];
    properties:any;
    sortedKeys: string[];

    constructor(){
        this.init();
    }

    init() : void{
        this.tasteeCodes = [];
        this.properties = propertiesReader();
    }

    addPluginFile(filePath : string, callback: any) :void {
        var data = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        this.extractTasteeCode(data);
        if (callback) {
            return callback();
        }
    }

    toSeleniumCode(tasteeLinesArray : string[]) : Instruction[] {
        let seleniumCodeLines:string[];
        let instructions = [];
        for (var i = 0; i < tasteeLinesArray.length; i++) {
            var line = tasteeLinesArray[i].trim();
            seleniumCodeLines = TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes);

            let command = '';
            if(seleniumCodeLines !== undefined ){
                for (var j = 0; j < seleniumCodeLines.length; j++) {
                    command += this._convertParamToValue(seleniumCodeLines[j].trim());
                    if(j !== seleniumCodeLines.length-1){
                        command += '\n';
                    }
                }
            }
            instructions.push(new Instruction(i, line, command));
        }
        return instructions;
    }

    addParamFile(filePath) : void {
        this.properties.append(filePath);
        this.sortedKeys = Object.keys(this.properties.getAllProperties());
        this.sortedKeys.sort(function(a, b){
            // DESC -> b.length - a.length
            return b.length - a.length;
        });
    }

    setParam(key : string, value : string){
        this.properties.set(key, value);
    }

    extractTasteeCode(data : any) : void {        
        let current : TasteeCode;

        for(let key of Object.keys(data)){
            let tasteeCode = new TasteeCode(key);
            if(data[key]){
                for(let instruction of data[key]){
                    if(instruction){
                        tasteeCode.addCodeLines(TasteeCodeMatcher.getSeleniumCodeFrom(instruction, this.tasteeCodes))
                    }
                }   
            } 
            this.tasteeCodes.push(tasteeCode);
        }
        //once done review lines inside tasteeCode
        this._reviewInnerTasteeCode(0);
    }

    private _convertParamToValue(tasteeLine: string) : string {
        //iterate on key by length in order to make sure, we don't mix keys using split
        this.sortedKeys.forEach((key) => {
            let value = this.properties.get(key);
            tasteeLine = tasteeLine.split(key).join("'"+value+"'");
        });
        return tasteeLine;
    }

    private _reviewInnerTasteeCode(reviewNumber) : void {
        let hasChanged = false;
        let newLines : string[];

        if(reviewNumber < 10) {
            for (let tasteeCode of this.tasteeCodes) {
                newLines = [];
                for (let line of tasteeCode.codeLines) {
                    let seleniumLines = TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes);

                    newLines = newLines.concat(seleniumLines);

                    if(line != seleniumLines[0]){
                        hasChanged = true;
                    }
                }
                tasteeCode.codeLines = newLines;
            }
            if(hasChanged){
                this._reviewInnerTasteeCode(++reviewNumber);
            }
        }
    }
}

