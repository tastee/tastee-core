"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class TasteeReporter {
    constructor() { }
    generateConsoleLog(instructions) {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString());
        }
    }
    takeScreenShot(driver, rapportPath, tasteeFileName, instruction) {
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
    }
}
exports.TasteeReporter = TasteeReporter;

//# sourceMappingURL=tastee-reporter.js.map
