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
        codeLine = codeLine.split(element).join(matcherArray[i + 1]);
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

    //once done review lines inside tasteeCode
    reviewInnerTasteeCode(0);
}

function reviewInnerTasteeCode(reviewNumber){
    var hasChanged = false;

    if(reviewNumber < 10){
        for (var instruction in tasteeCode) {
            var newLines = [];
            debug("================>Before : "+ tasteeCode[instruction].codeLines)
            for (var lineIndex in tasteeCode[instruction].codeLines) {
                var line = tasteeCode[instruction].codeLines[lineIndex];
                var isMatchingInstruction = _isTasteeLine(line);
                if (isMatchingInstruction) {
                      var seleniumCode =_extractSeleniumCode(isMatchingInstruction);
                      newLines = newLines.concat(seleniumCode);
                      hasChanged = true;
                }else {
                  newLines.push(line);
                }
            }

            tasteeCode[instruction].codeLines = newLines;
            debug("===============>After : "+ tasteeCode[instruction].codeLines)
            debug(" ");

            //Accept to run 10 times inside tasteecode imbrication
            if(hasChanged){
              reviewInnerTasteeCode(reviewNumber++);
            }
        }
    }
}

function _convertParamToValue(tasteeLine) {
    properties.each((key, value) => {
        tasteeLine = tasteeLine.split(key).join("'"+value+"'");
    });
    return tasteeLine;
}
////END of utility methods

exports.addPluginFile = function addPluginFile(filePath, callback) {
    fs.readFile(filePath, "utf8", function (err, data) {
        debug('Starting analysing : %s', filePath)
        if (!err) {
            _extractTasteeCode(data.split("\n"));
        }
        debug('End analysing : %s', filePath)
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

exports.clear = function addParamFile() {
    tasteeCode = {};
    properties = propertiesReader();
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
