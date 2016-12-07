import {Instruction} from './instruction';
import * as fs from 'fs';
import * as path from 'path';

export class TasteeReporter {

    builder = require('junit-report-builder');

    constructor() {}

    generateConsoleLog(instructions : Instruction[]) : void {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    }

    generateJunitReporter(instructions: Instruction[]) : void {
        var suite = this.builder.testSuite().name('My Tastee It');

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
        this.builder.writeTo('tastee-reporter-junit.xml');
    }

    takeScreenShot(driver : any, screenShotPath : string, instruction : Instruction) : void {
        if (screenShotPath !== undefined) {
            driver.takeScreenshot().then(
                function (image, err) {
                    if (!fs.existsSync(screenShotPath)) {
                        fs.mkdirSync(screenShotPath, 755);
                    }
                    fs.writeFile(path.join(screenShotPath, instruction.lineNumber + '.png'), image, 'base64', function (err) {
                        });
                }
            );
        }
    }
}

