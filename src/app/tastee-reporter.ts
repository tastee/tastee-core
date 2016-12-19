import { Instruction } from './instruction';
import * as fs from 'fs';
import * as path from 'path';
import * as mustache from 'mustache';

export class TasteeReporter {

    builder = require('junit-report-builder');
    constructor() { }

    generateConsoleLog(instructions: Instruction[]): void {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    }

    generateJunitReporter(instructions: Instruction[]): void {
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


    generateHtmlReporter(rapportPath: string, nameOfTest: string, instructions: Instruction[]): void {
        var fields = {
            nameOfTest: nameOfTest,
            instructions: instructions,
            "format": function () {
                if (this.tasteeLine !== "") {
                    var imagePath=path.join("screen",nameOfTest,this.lineNumber + ".png")
                    if (this.valid === true) {
                        return "<div><p class=\"green-text\">" + this.tasteeLine + "</p><img class=\"materialboxed\" width=\"650\" src=\""+imagePath+"\"></div>"
                    } else {
                        return "<div><p class=\"red-text\">" + this.tasteeLine + "</p><pclass=\"red-text\">" + this.errorMessage + "</p><img class=\"materialboxed\" width=\"650\" src=\""+imagePath+"\"></div>"
                    }
                }
            }
        };
        fs.readFile(path.join(__dirname, "../html", "index.html"), "utf8", function (err, data) {
            var output = mustache.to_html(data, fields);
            fs.writeFile(path.join(rapportPath, nameOfTest + '.html'), output, function (err) { });
            fs.createReadStream(path.join(__dirname, "../html", "home.png")).pipe(fs.createWriteStream(path.join(rapportPath, 'home.png')));

        });


    }

    takeScreenShot(driver: any, rapportPath: string, tasteeFileName: string, instruction: Instruction): void {
        if (rapportPath !== undefined) {
            driver.takeScreenshot().then(
                function (image, err) {
                    if (!fs.existsSync(rapportPath)) {
                        fs.mkdirSync(rapportPath);
                    }
                    if (!fs.existsSync(path.join(rapportPath,'screen'))) {
                        fs.mkdirSync(path.join(rapportPath,'screen'));
                    } 
                    if (!fs.existsSync(path.join(rapportPath,'screen',tasteeFileName))) {
                        fs.mkdirSync(path.join(rapportPath,'screen',tasteeFileName));
                    }                    
                    fs.writeFile(path.join(rapportPath,'screen',tasteeFileName,instruction.lineNumber + '.png'), image, 'base64', function (err) {
                    });
                }
            );
        }
    }
}

