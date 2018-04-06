import { Instruction } from './instruction';
import { TasteeReporter } from './tastee-reporter';
import * as logger from "winston";
declare var assert: any;
var assert = require('assert');

export class TasteeEngine {

    webdriver = require('selenium-webdriver');
    reporter: TasteeReporter;

    driver: any;

    constructor(browser: string, headlessMode: Boolean = false) {
        
        if (browser) {
            this.webdriver = require('selenium-webdriver');
            switch (browser) {
                case 'chrome':
                    if (headlessMode) {
                        var chrome = require('selenium-webdriver/chrome');
                        this.driver = new this.webdriver.Builder()
                            .withCapabilities(this.webdriver.Capabilities.chrome())
                            .setChromeOptions(new chrome.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new this.webdriver.Builder()
                            .forBrowser('chrome')
                            .build();
                    }
                    break;
                case 'firefox':
                    if (headlessMode) {
                        var firefox = require('selenium-webdriver/firefox');
                        this.driver = new this.webdriver.Builder()
                            .withCapabilities(this.webdriver.Capabilities.firefox())
                            .setFirefoxOptions(new firefox.Options().headless())
                            .build();
                    }
                    else {
                        this.driver = new this.webdriver.Builder()
                            .forBrowser('firefox')
                            .build();
                    }
                    break;
            }
        }
        this.reporter = new TasteeReporter();
    }

    stop(): void {
        this.driver.quit();
    }

    async execute(codeToExecute: Instruction[], tasteeFileName: string): Promise<Instruction[]> {
        var By = this.webdriver.By;
        var Key = this.webdriver.Key;
        var until = this.webdriver.until;
        var Actions = this.webdriver.Actions;
        let driver = this.driver;
        let reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                logger.debug('Executing : %s', codeToExecute[idx].command)
                await eval(codeToExecute[idx].command);
                logger.debug('Execution SUCCESS');
                await codeToExecute[idx].setValid(true);
            } catch (error) {
                logger.debug('Execution Failed : %s', error);
                logger.error(error);
                await codeToExecute[idx].setValid(false);
                await codeToExecute[idx].setErrorMessage(error.message);
            }
        }
        return codeToExecute;
    }

}

