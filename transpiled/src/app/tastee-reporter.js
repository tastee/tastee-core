"use strict";
var fs = require("fs");
var path = require("path");
var mustache = require("mustache");
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
    TasteeReporter.prototype.generateHtmlReporter = function (rapportPath, nameOfTest, instructions) {
        var fields = {
            nameOfTest: nameOfTest,
            instructions: instructions,
            "format": function () {
                if (this.tasteeLine !== "") {
                    var imagePath = path.join("screen", nameOfTest, this.lineNumber + ".png");
                    if (this.valid === true) {
                        return "<li><div class=\"collapsible-header\"><p class=\"green-text\">" + this.tasteeLine + "</p></div><div class=\"collapsible-body\"><img class=\"materialboxed\" width=\"650\" src=\"" + imagePath + "\"></div></li>";
                    }
                    else {
                        return "<li><div class=\"collapsible-header\"><p class=\"red-text\">" + this.tasteeLine + "</p></div><div class=\"collapsible-body\"><pclass=\"red-text\">" + this.errorMessage + "</p><img class=\"materialboxed\" width=\"650\" src=\"" + imagePath + "\"></div></li>";
                    }
                }
            }
        };
        fs.readFile(path.join(__dirname, "../html", "index.html"), "utf8", function (err, data) {
            var output = mustache.to_html(data, fields);
            fs.writeFile(path.join(rapportPath, nameOfTest + '.html'), output, function (err) { });
            fs.createReadStream(path.join(__dirname, "../html", "home.png")).pipe(fs.createWriteStream(path.join(rapportPath, 'home.png')));
        });
    };
    TasteeReporter.prototype.takeScreenShot = function (driver, rapportPath, tasteeFileName, instruction) {
        if (rapportPath !== undefined) {
            driver.takeScreenshot().then(function (image, err) {
                if (!fs.existsSync(rapportPath)) {
                    fs.mkdirSync(rapportPath);
                }
                if (!fs.existsSync(path.join(rapportPath, 'screen'))) {
                    fs.mkdirSync(path.join(rapportPath, 'screen'));
                }
                if (tasteeFileName === undefined) {
                    tasteeFileName = 'debug';
                }
                if (!fs.existsSync(path.join(rapportPath, 'screen', tasteeFileName))) {
                    fs.mkdirSync(path.join(rapportPath, 'screen', tasteeFileName));
                }
                fs.writeFile(path.join(rapportPath, 'screen', tasteeFileName, instruction.lineNumber + '.png'), image, 'base64', function (err) {
                });
            });
        }
    };
    return TasteeReporter;
}());
exports.TasteeReporter = TasteeReporter;

//# sourceMappingURL=tastee-reporter.js.map
