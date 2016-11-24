"use strict";

var debug = require('debug')('analyser');

// fs is to manage file from the fileSystem
var fs = require("fs");
var propertiesReader = require("properties-reader");
var Instruction = require('./instruction')
/**
 * Tastee code will contains a map of instructions with their parameters and corresponding code line.
 * its is mapped by the full instruction line
 * example :
 *{
 *     "my instructions with $oneParame or $moreParameters" : {
 *        parameters : [ "$oneParame", "$moreParameters"],
 *        regexMatcher : "my instructions with (.*) or (.*)"
 *        codeLines : [
 *            "driver.doSomething(),
 *            "myOtherCustom instruction $oneParam",
 *            "driver.doSomethingElse($moreParameters)"
 *        ]
 *    }
 *  }
 */

var tasteeCode = {};
var properties = propertiesReader();

////utility methods
function _replaceTasteeParameters(codeLine, parametersArray, matcherArray) {
    parametersArray.forEach(function (element, i) {
        var joiner = matcherArray[i + 1];
        if (joiner && !joiner.startsWith("$")) {
            joiner = "'" + joiner + "'";
        }
        codeLine = codeLine.split(element).join(joiner);
    });
    return codeLine;
}

function _extractSeleniumCode(isMatchingInstruction) {
    var seleniumCode = [];
    var codeLines = tasteeCode[isMatchingInstruction.instruction].codeLines;
    for (var i = 0; i < codeLines.length; i++) {
        var codeLine = _replaceTasteeParameters(codeLines[i], tasteeCode[isMatchingInstruction.instruction].parameters, isMatchingInstruction.isMatching);
        seleniumCode.push(codeLine);
    }
    return seleniumCode;
}

function _isTasteeLine(tasteeLine) {
    for (var instruction in tasteeCode) {
        if (tasteeCode.hasOwnProperty(instruction)) {
            var isMatching = tasteeLine.match(new RegExp(tasteeCode[instruction].regexMatcher));
            if (isMatching) {
                return {
                    instruction,
                    isMatching
                };
            }
        }
    }
    return;
}

function _getSeleniumCodeFrom(tasteeLine) {
    var isMatchingInstruction = _isTasteeLine(tasteeLine);
    if (isMatchingInstruction) {
        return _extractSeleniumCode(isMatchingInstruction);
    }
    return [tasteeLine];
}

function _extractTasteeCode(fileLinesArray) {
    var currentInstruction;
    var currentParameters;
    var currentCodeLines = [];
    var currentRegexMatcher;

    for (var i = 0; i < fileLinesArray.length; i++) {
        var line = fileLinesArray[i].trim();

        if (line.endsWith("*{")) {
            currentInstruction = line.substring(0, line.length - 2).trim();
            currentParameters = currentInstruction.match(/\$\w*/gi);
            currentRegexMatcher = "^" + currentInstruction;
            if (currentParameters) {
                currentRegexMatcher = "^" + currentInstruction.replace(new RegExp("\\" + currentParameters.join("|\\"), "g"), "(.*)");
            }
            currentCodeLines = [];
        } else if (line.startsWith("}*")) {
            tasteeCode[currentInstruction] = {
                "parameters": [].concat(currentParameters),
                "codeLines": currentCodeLines,
                "regexMatcher": currentRegexMatcher
            };
        } else if (line) {
            var seleniumCode = _getSeleniumCodeFrom(line);
            if (seleniumCode) {
                currentCodeLines = currentCodeLines.concat(seleniumCode);
            } else {
                currentCodeLines.push(line);
            }
        }
    }
}

function _convertParamToValue(tasteeLine) {
    properties.each((key, value) => {
        tasteeLine = tasteeLine.split(key).join(value);
    });
    return tasteeLine;
}
////END of utility methods

exports.addPluginFile = function addPluginFile(filePath, callback) {
    fs.readFile(filePath, "utf8", function (err, data) {
        if (!err) {
            _extractTasteeCode(data.split("\n"));
        }
        if (callback) {
            return callback();
        }
    });
};

exports.addParamFile = function addParamFile(filePath) {
    properties.append(filePath);
};

exports.getTasteeCode = function getTasteeCode() {
    return tasteeCode;
};

exports.toSeleniumCode = function toSeleniumCode(tasteeScriptLinesArray) {
    var instructions = [];
    for (var i = 0; i < tasteeScriptLinesArray.length; i++) {
        var tasteeLine = tasteeScriptLinesArray[i].trim();
        tasteeLine = _convertParamToValue(tasteeLine);
        var seleniumCode = _getSeleniumCodeFrom(tasteeLine);
        var instruction = new Instruction(i, tasteeLine, seleniumCode !== undefined ? seleniumCode.join('\n') : []);
        instructions = instructions.concat(instruction);
    }
    return instructions;
};
