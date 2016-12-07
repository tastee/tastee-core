"use strict";
var fs = require('fs');
var path = require('path');
var TasteeReporter = (function () {
    function TasteeReporter() {
        this.builder = require('junit-report-builder');
    }
    TasteeReporter.prototype.generateConsoleLog = function (instructions) {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString());
        }
    };
    TasteeReporter.prototype.generateJunitReporter = function (instructions) {
        var suite = this.builder.testSuite().name('My Tastee It');
        for (var i = 0; i < instructions.length; i++) {
            if (instructions[i].tasteeLine !== "") {
                if (instructions[i].valid) {
                    suite.testCase()
                        .className('instruction')
                        .name(instructions[i].tasteeLine);
                }
                else {
                    suite.testCase()
                        .className('instruction')
                        .name(instructions[i].tasteeLine)
                        .failure(instructions[i].errorMessage);
                }
            }
        }
        this.builder.writeTo('tastee-reporter-junit.xml');
    };
    TasteeReporter.prototype.takeScreenShot = function (driver, screenShotPath, instruction) {
        if (screenShotPath !== undefined) {
            driver.takeScreenshot().then(function (image, err) {
                if (!fs.existsSync(screenShotPath)) {
                    fs.mkdirSync(screenShotPath, 755);
                }
                fs.writeFile(path.join(screenShotPath, instruction.lineNumber + '.png'), image, 'base64', function (err) {
                });
            });
        }
    };
    return TasteeReporter;
}());
exports.TasteeReporter = TasteeReporter;

//# sourceMappingURL=tastee-reporter.js.map
