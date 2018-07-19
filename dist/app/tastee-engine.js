"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_reporter_1 = require("./tastee-reporter");
const selenium = require("selenium-webdriver");
const logger = require("winston");
const assert = require('assert');
class TasteeEngine {
    constructor(browser, headlessMode = false) {
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
        this.reporter = new tastee_reporter_1.TasteeReporter();
    }
    stop() {
        this.driver.quit();
    }
    execute(codeToExecute, tasteeFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._executeCommand(codeToExecute);
        });
    }
    _executeCommand(codeToExecute, currentLineIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
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
                logger.debug('Execution SUCCESS.');
                instruction.setValid(true);
                return this._executeCommand(codeToExecute, currentLineIndex + 1);
            })
                .catch(error => {
                logger.debug('Execution FAILED : %s', error);
                logger.error(error);
                instruction.setValid(false);
                instruction.setErrorMessage(error.message);
                return this._executeCommand(codeToExecute, currentLineIndex + 1);
            });
        });
    }
}
exports.TasteeEngine = TasteeEngine;

//# sourceMappingURL=tastee-engine.js.map
