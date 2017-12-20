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
var assert = require('assert');
class TasteeEngine {
    constructor(browser, headlessMode = false) {
        this.webdriver = require('selenium-webdriver');
        if (browser) {
            require('geckodriver');
            require('chromedriver');
            if (headlessMode) {
                const firefox = require('selenium-webdriver/firefox');
                const chrome = require('selenium-webdriver/chrome');
                this.driver = new this.webdriver.Builder()
                    .forBrowser(browser)
                    .setChromeOptions(new chrome.Options().headless())
                    .setFirefoxOptions(new firefox.Options().headless())
                    .build();
            }
            else {
                this.driver = new this.webdriver.Builder().forBrowser(browser).build();
            }
        }
        this.reporter = new tastee_reporter_1.TasteeReporter();
    }
    stop() {
        this.driver.quit();
    }
    execute(codeToExecute, tasteeFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            var By = this.webdriver.By;
            var Key = this.webdriver.Key;
            var until = this.webdriver.until;
            var Actions = this.webdriver.Actions;
            let driver = this.driver;
            let reporter = this.reporter;
            for (var idx = 0; idx < codeToExecute.length; idx++) {
                try {
                    yield eval(codeToExecute[idx].command);
                    yield codeToExecute[idx].setValid(true);
                }
                catch (error) {
                    console.log(error);
                    yield codeToExecute[idx].setValid(false);
                    yield codeToExecute[idx].setErrorMessage(error.message);
                }
            }
            return codeToExecute;
        });
    }
}
exports.TasteeEngine = TasteeEngine;

//# sourceMappingURL=tastee-engine.js.map
