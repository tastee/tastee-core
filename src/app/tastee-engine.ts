import { Instruction } from "./instruction";
import { TasteeReporter } from "./tastee-reporter";

declare var assert: any;
var assert = require('assert');

export class TasteeEngine {

    webdriver = require('selenium-webdriver');
    reporter: TasteeReporter;

    driver: any;
    screenShotPath: string;

    constructor(browser: any, path: string) {
        if (browser) {
            this.driver = new this.webdriver.Builder().forBrowser(browser).build();
        }
        this.screenShotPath = path;
        this.reporter = new TasteeReporter();
    }

    stop(): void {
        this.driver.quit();
    }

    execute(codeToExecute: Instruction[], tasteeFileName: string): Instruction[] {
        var By = this.webdriver.By;
        var Actions = this.webdriver.Actions;
        let screenShotPath = this.screenShotPath;
        let driver = this.driver;
        let reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                eval(codeToExecute[idx].command);
                codeToExecute[idx].setValid(true);
                reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);
            } catch (error) {
                codeToExecute[idx].setValid(false);
                codeToExecute[idx].setErrorMessage(error.message);
                reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);
            }
        }
        return codeToExecute;
    }

}

