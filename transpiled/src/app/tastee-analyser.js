"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var tastee_code_1 = require("./tastee-code");
var instruction_1 = require("./instruction");
var propertiesReader = require('properties-reader');
var yaml = require('js-yaml');
var TasteeAnalyser = /** @class */ (function () {
    function TasteeAnalyser() {
        this.tasteeCodes = [];
        this.properties = propertiesReader();
    }
    TasteeAnalyser.prototype.addPluginFile = function (filePath, callback) {
        var data = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        this.extractTasteeCode(data);
        if (callback) {
            return callback();
        }
    };
    TasteeAnalyser.prototype.toSeleniumCode = function (tasteeLinesArray) {
        var seleniumCodeLines;
        var instructions = [];
        for (var i = 0; i < tasteeLinesArray.length; i++) {
            var line = this._convertParamToValue(tasteeLinesArray[i].trim());
            seleniumCodeLines = tastee_code_1.TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes);
            instructions.push(new instruction_1.Instruction(i, line, seleniumCodeLines !== undefined ? seleniumCodeLines.join('\n') : ''));
        }
        return instructions;
    };
    TasteeAnalyser.prototype.addParamFile = function (filePath) {
        this.properties.append(filePath);
    };
    TasteeAnalyser.prototype.setParam = function (key, value) {
        this.properties.set(key, value);
    };
    TasteeAnalyser.prototype.extractTasteeCode = function (data) {
        var current;
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            var tasteeCode = new tastee_code_1.TasteeCode(key);
            for (var _b = 0, _c = data[key]; _b < _c.length; _b++) {
                var instruction = _c[_b];
                tasteeCode.addCodeLines(tastee_code_1.TasteeCodeMatcher.getSeleniumCodeFrom(instruction, this.tasteeCodes));
            }
            this.tasteeCodes.push(tasteeCode);
        }
        //once done review lines inside tasteeCode
        this._reviewInnerTasteeCode(0);
    };
    TasteeAnalyser.prototype._convertParamToValue = function (tasteeLine) {
        this.properties.each(function (key, value) {
            tasteeLine = tasteeLine.split(key).join("'" + value + "'");
        });
        return tasteeLine;
    };
    TasteeAnalyser.prototype._reviewInnerTasteeCode = function (reviewNumber) {
        var hasChanged = false;
        var newLines;
        if (reviewNumber < 10) {
            for (var _i = 0, _a = this.tasteeCodes; _i < _a.length; _i++) {
                var tasteeCode = _a[_i];
                newLines = [];
                for (var _b = 0, _c = tasteeCode.codeLines; _b < _c.length; _b++) {
                    var line = _c[_b];
                    var seleniumLines = tastee_code_1.TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes);
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
    };
    return TasteeAnalyser;
}());
exports.TasteeAnalyser = TasteeAnalyser;

//# sourceMappingURL=tastee-analyser.js.map
