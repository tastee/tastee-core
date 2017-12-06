import { Instruction } from './instruction';
import * as fs from 'fs';
import * as path from 'path';
import * as mustache from 'mustache';

export class TasteeReporter {

    constructor() { }

    generateConsoleLog(instructions: Instruction[]): void {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    }

    takeScreenShot(driver: any, rapportPath: string, tasteeFileName: string, instruction: Instruction): void {
        if (rapportPath !== undefined) {
            driver.takeScreenshot().then(
                function (image, err) {
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
                }
            );
        }
    }
}

