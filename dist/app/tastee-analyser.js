"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const tastee_code_1 = require("./tastee-code");
const instruction_1 = require("./instruction");
var propertiesReader = require('properties-reader');
const yaml = require('js-yaml');
class TasteeAnalyser {
    constructor() {
        this.init();
    }
    init() {
        this.tasteeCodes = [];
        this.properties = propertiesReader();
    }
    addPluginFile(filePath, callback) {
        var data = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        this.extractTasteeCode(data);
        if (callback) {
            return callback();
        }
    }
    toJsCode(tasteeLinesArray) {
        let jsCodeLines;
        let instructions = [];
        for (var i = 0; i < tasteeLinesArray.length; i++) {
            var line = tasteeLinesArray[i].trim();
            jsCodeLines = tastee_code_1.TasteeCodeMatcher.getJsCodeFrom(line, this.tasteeCodes);
            let command = '';
            if (jsCodeLines !== undefined) {
                for (var j = 0; j < jsCodeLines.length; j++) {
                    command += this._convertParamToValue(jsCodeLines[j].trim());
                    if (j !== jsCodeLines.length - 1) {
                        command += '\n';
                    }
                }
            }
            instructions.push(new instruction_1.Instruction(i, line, command));
        }
        return instructions;
    }
    addParamFile(filePath) {
        this.properties.append(filePath);
        this.sortedKeys = Object.keys(this.properties.getAllProperties());
        this.sortedKeys.sort(function (a, b) {
            // DESC -> b.length - a.length
            return b.length - a.length;
        });
    }
    setParam(key, value) {
        this.properties.set(key, value);
    }
    extractTasteeCode(data) {
        let current;
        for (let key of Object.keys(data)) {
            let tasteeCode = new tastee_code_1.TasteeCode(key);
            for (let instruction of data[key]) {
                tasteeCode.addCodeLines(tastee_code_1.TasteeCodeMatcher.getJsCodeFrom(instruction, this.tasteeCodes));
            }
            this.tasteeCodes.push(tasteeCode);
        }
        //once done review lines inside tasteeCode
        this._reviewInnerTasteeCode(0);
    }
    _convertParamToValue(tasteeLine) {
        //iterate on key by length in order to make sure, we don't mix keys using split
        if (this.sortedKeys) {
            this.sortedKeys.forEach((key) => {
                let value = this.properties.get(key);
                tasteeLine = tasteeLine.split(key).join("'" + value + "'");
            });
        }
        return tasteeLine;
    }
    _reviewInnerTasteeCode(reviewNumber) {
        let hasChanged = false;
        let newLines;
        if (reviewNumber < 10) {
            for (let tasteeCode of this.tasteeCodes) {
                newLines = [];
                for (let line of tasteeCode.codeLines) {
                    let seleniumLines = tastee_code_1.TasteeCodeMatcher.getJsCodeFrom(line, this.tasteeCodes);
                    newLines = newLines.concat(seleniumLines);
                    if (line != seleniumLines[0]) {
                        hasChanged = true;
                    }
                }
                tasteeCode.codeLines = newLines;
            }
            if (hasChanged) {
                this._reviewInnerTasteeCode(++reviewNumber);
            }
        }
    }
}
exports.TasteeAnalyser = TasteeAnalyser;

//# sourceMappingURL=tastee-analyser.js.map
