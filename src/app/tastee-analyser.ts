import * as fs from 'fs';
import {TasteeCode, TasteeCodeMatcher} from "./tastee-code";
import {Instruction} from "./instruction";


declare var propertiesReader: any;
var propertiesReader = require('properties-reader');

export class TasteeAnalyser {

    tasteeCodes:TasteeCode[];
    properties:any;

    constructor(){
        this.tasteeCodes = [];
        this.properties = propertiesReader();
    }

    addPluginFile(filePath : string, callback: any) :void {

        let that =this;
        fs.readFile(filePath, "utf8", function (err, data) {

            if (!err) {
                that._extractTasteeCode(data.split("\n"));
            }

            if (callback) {
                return callback();
            }
        });
    }

    toSeleniumCode(tasteeLinesArray : string[]) : Instruction[] {
        let seleniumCodeLines:string[];
        let instructions = [];
        for (var i = 0; i < tasteeLinesArray.length; i++) {

            var line = this._convertParamToValue(tasteeLinesArray[i].trim());
            seleniumCodeLines = TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes);
            instructions.push(new Instruction(i, line, seleniumCodeLines !== undefined ? seleniumCodeLines.join('\n') : ''));
        }
        return instructions;
    }

    addParamFile(filePath) : void {
        this.properties.append(filePath);
    };

    private _convertParamToValue(tasteeLine) : string {
        this.properties.each((key, value) => {
            tasteeLine = tasteeLine.split(key).join("'"+value+"'");
        });
        return tasteeLine;
    }

    private _extractTasteeCode(fileLinesArray : string[]) : void {

        let current : TasteeCode;
        for (let line of fileLinesArray) {
            line = line.trim();
            if (line.endsWith("*{")) { //start a tastee code
                current = new TasteeCode(line.substring(0, line.length - 2).trim());

            }else if (line.startsWith("}*")) { //end tastee code
                this.tasteeCodes.push(current);

            } else if (line) { //tastee code instruction
                current.addCodeLines(TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes));
            }
        }

        //once done review lines inside tasteeCode
        this._reviewInnerTasteeCode(0);
    }

    private _reviewInnerTasteeCode(reviewNumber) : void {
        let hasChanged = false;
        let newLines : string[];

        //limit to 10 review in order to avoid infinite treatment
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

