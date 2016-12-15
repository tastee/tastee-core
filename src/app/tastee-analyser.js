"use strict";
var fs = require("fs");
var tastee_code_1 = require("./tastee-code");
var instruction_1 = require("./instruction");
var propertiesReader = require('properties-reader');
var TasteeAnalyser = (function () {
    function TasteeAnalyser() {
        this.tasteeCodes = [];
        this.properties = propertiesReader();
    }
    TasteeAnalyser.prototype.addPluginFile = function (filePath, callback) {
        var that = this;
        fs.readFile(filePath, "utf8", function (err, data) {
            if (!err) {
                that._extractTasteeCode(data.split("\n"));
            }
            if (callback) {
                return callback();
            }
        });
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
    ;
    TasteeAnalyser.prototype._convertParamToValue = function (tasteeLine) {
        this.properties.each(function (key, value) {
            tasteeLine = tasteeLine.split(key).join("'" + value + "'");
        });
        return tasteeLine;
    };
    TasteeAnalyser.prototype._extractTasteeCode = function (fileLinesArray) {
        var current;
        for (var _i = 0, fileLinesArray_1 = fileLinesArray; _i < fileLinesArray_1.length; _i++) {
            var line = fileLinesArray_1[_i];
            line = line.trim();
            if (line.endsWith("*{")) {
                current = new tastee_code_1.TasteeCode(line.substring(0, line.length - 2).trim());
            }
            else if (line.startsWith("}*")) {
                this.tasteeCodes.push(current);
            }
            else if (line) {
                current.addCodeLines(tastee_code_1.TasteeCodeMatcher.getSeleniumCodeFrom(line, this.tasteeCodes));
            }
        }
        //once done review lines inside tasteeCode
        this._reviewInnerTasteeCode(0);
    };
    TasteeAnalyser.prototype._reviewInnerTasteeCode = function (reviewNumber) {
        var hasChanged = false;
        var newLines;
        //limit to 10 review in order to avoid infinite treatment
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
