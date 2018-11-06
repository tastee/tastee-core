import { Instruction } from './instruction';
import { TasteeReporter } from './tastee-reporter';
import * as selenium from 'selenium-webdriver';
import * as winston from "winston";
const assert = require('assert');

export class TasteeEngine {

    reporter: TasteeReporter;
    driver: selenium.WebDriver;
    logger: winston.Logger;

    constructor(browser: string, headlessMode: boolean = false, logger?: winston.Logger) {

        if(logger){
            this.logger =logger;
        }else {
            this.logger = winston.loggers.get('tasteeLog');
            this.logger.configure({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.splat(),
                    winston.format.simple()
                  ),
                transports: [
                    new winston.transports.Console()
                ]
              });
        }

        if (browser) {
            let webdriver = require('selenium-webdriver');
            switch (browser) {
                case 'chrome':
                    if (headlessMode) {
                        var chrome = require('selenium-webdriver/chrome');
                        this.driver = new webdriver.Builder()
                            .withCapabilities(selenium.Capabilities.chrome())
                            .setChromeOptions(new chrome.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new webdriver.Builder()
                            .forBrowser('chrome')
                            .build();
                    }
                    break;
                case 'firefox':
                    if (headlessMode) {
                        var firefox = require('selenium-webdriver/firefox');
                        this.driver = new webdriver.Builder()
                            .withCapabilities(selenium.Capabilities.firefox())
                            .setFirefoxOptions(new firefox.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new webdriver.Builder()
                            .forBrowser('firefox')
                            .build();
                    }
                    break;
                default:
                    this.driver = new webdriver.Builder()
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

    async execute(codeToExecute: Instruction[]): Promise<Instruction[]> {
        var By = selenium.By;
        var Key = selenium.Key;
        var until = selenium.until;
        var Actions = selenium.Actions;
        let driver = this.driver;
        let reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                const instruction = codeToExecute[idx];

                this.logger.debug('Executing line "%s"', instruction.tasteeLine);
                this.logger.debug('with command "%s"', instruction.command);

                await eval(codeToExecute[idx].command);
                this.logger.debug('Execution SUCCESS.\n')
                await codeToExecute[idx].setValid(true);
            } catch (error) {
                this.logger.debug('Execution FAILED : %s\n', error);
                await codeToExecute[idx].setValid(false);
                await codeToExecute[idx].setErrorMessage(error.message);
            }
        }
        return codeToExecute;
}

   /* async execute(codeToExecute: Instruction[], tasteeFileName: string): Promise<Instruction[]> {
        return this._executeCommand(codeToExecute);
    }

    /*private async _executeCommand(codeToExecute: Instruction[], currentLineIndex: number = 0): Promise<Instruction[]> {
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

        this.logger.debug('Executing line "%s"', instruction.tasteeLine);
        this.logger.debug('with command "%s"', instruction.command);

        return new Promise(async function(resolve, reject) {
            await (eval(instruction.command));
            resolve();
        })
        .then(() => {
            this.logger.debug('Execution SUCCESS.\n')
            instruction.setValid(true);
            return this._executeCommand(codeToExecute, currentLineIndex+1);
        })
        .catch(error => {
            this.logger.debug('Execution FAILED : %s\n', error);

            instruction.setValid(false);
            instruction.setErrorMessage(error.message);
            return this._executeCommand(codeToExecute, currentLineIndex+1);
        });
       
    }*/

}

