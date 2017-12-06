"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tastee_reporter_1 = require("./tastee-reporter");
var assert = require('assert');
var TasteeEngine = /** @class */ (function () {
    function TasteeEngine(browser, path) {
        this.webdriver = require('selenium-webdriver');
        if (browser) {
            this.driver = new this.webdriver.Builder().forBrowser(browser).build();
        }
        this.screenShotPath = path;
        this.reporter = new tastee_reporter_1.TasteeReporter();
    }
    TasteeEngine.prototype.stop = function () {
        this.driver.quit();
    };
    TasteeEngine.prototype.execute = function (codeToExecute, tasteeFileName) {
        var By = this.webdriver.By;
        var Actions = this.webdriver.Actions;
        var screenShotPath = this.screenShotPath;
        var driver = this.driver;
        var reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                eval(codeToExecute[idx].command);
                codeToExecute[idx].setValid(true);
                reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);
            }
            catch (error) {
                codeToExecute[idx].setValid(false);
                codeToExecute[idx].setErrorMessage(error.message);
                reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[idx]);
            }
        }
        return codeToExecute;
    };
    return TasteeEngine;
}());
exports.TasteeEngine = TasteeEngine;

//# sourceMappingURL=tastee-engine.js.map
