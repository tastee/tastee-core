
var builder = require('junit-report-builder');
var fs = require('node-fs');
var path = require('path');

module.exports = {
    generateConsoleLog(instructions) {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    },
    generateJunitReporter(instructions) {
        var suite = builder.testSuite().name('My Tastee It');

        for (var i = 0; i < instructions.length; i++) {
            if (instructions[i].tasteeLine !== "") {
                if (instructions[i].valid) {
                    suite.testCase()
                        .className('instruction')
                        .name(instructions[i].tasteeLine);
                } else {
                    suite.testCase()
                        .className('instruction')
                        .name(instructions[i].tasteeLine)
                        .failure(instructions[i].errorMessage);
                }
            }
        }
        builder.writeTo('tastee-reporter-junit.xml');

    },
    takeScreenShot(driver, screenShotPath, instruction) {
        if (screenShotPath !== undefined) {
            driver.takeScreenshot().then(
                function (image, err) {
                    if (!fs.existsSync(screenShotPath)) {
                        fs.mkdirSync(screenShotPath, 0655, true);
                    }
                    fs.writeFile(path.join(screenShotPath, instruction.numberLine + '.png'), image, 'base64', function (err) {
                    });
                }
            );
        }
    }

};