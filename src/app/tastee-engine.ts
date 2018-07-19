import { Instruction } from './instruction';
import { TasteeReporter } from './tastee-reporter';
import * as selenium from 'selenium-webdriver';
import * as logger from "winston";
const assert = require('assert');

export class TasteeEngine {

    reporter: TasteeReporter;
    driver: selenium.WebDriver;

    constructor(browser: string, headlessMode: boolean = false) {

        if (browser) {
            switch (browser) {
                case 'chrome':
                    if (headlessMode) {
                        var chrome = require('selenium-webdriver/chrome');
                        this.driver = new selenium.Builder()
                            .withCapabilities(selenium.Capabilities.chrome())
                            .setChromeOptions(new chrome.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new selenium.Builder()
                            .forBrowser('chrome')
                            .build();
                    }
                    break;
                case 'firefox':
                    if (headlessMode) {
                        var firefox = require('selenium-webdriver/firefox');
                        this.driver = new selenium.Builder()
                            .withCapabilities(selenium.Capabilities.firefox())
                            .setFirefoxOptions(new firefox.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new selenium.Builder()
                            .forBrowser('firefox')
                            .build();
                    }
                    break;
                default:
                    this.driver = new selenium.Builder()
                        .forBrowser('phantomjs')
                        .build();
                    break;
            }
        }
        this.reporter = new TasteeReporter();
    }

    stop(): void {
        this.driver.quit();
    }

    async execute(codeToExecute: Instruction[], tasteeFileName: string): Promise<Instruction[]> {
        return this._executeCommand(codeToExecute);
    }

    private async _executeCommand(codeToExecute: Instruction[], currentLineIndex: number = 0) {
        if (currentLineIndex === codeToExecute.length) {
            return Promise.resolve(codeToExecute);
        }
        const By = selenium.By;
        const Key = selenium.Key;
        const until = selenium.until;
        const Actions = selenium.ActionSequence;
        const driver = this.driver;
        const reporter = this.reporter;

        const instruction = codeToExecute[currentLineIndex];
        const result = eval(instruction.command);
        return Promise.resolve(result)
            .then(() => {
                logger.debug('Execution SUCCESS.')
                instruction.setValid(true);
                return this._executeCommand(codeToExecute, currentLineIndex+1);
            })
            .catch(error => {
                logger.debug('Execution FAILED : %s', error);
                logger.error(error);
                instruction.setValid(false);
                instruction.setErrorMessage(error.message);
                return this._executeCommand(codeToExecute, currentLineIndex+1);
            });
    }

}

