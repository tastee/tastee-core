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
        var ManagedPromise = this.webdriver.ManagedPromise;
        var flow = this.webdriver.promise.controlFlow();
        var screenShotPath = this.screenShotPath;
        var driver = this.driver;
        var reporter = this.reporter;
        return flow.execute(function () {
            for (var idx = 0; idx < codeToExecute.length; idx++) {
                flow.execute(function () {
                    eval(codeToExecute[this].command);
                }.bind(idx)).then(function () {
                    codeToExecute[this].setValid(true);
                    reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[this]);
                }.bind(idx), function (error) {
                    codeToExecute[this].setValid(false);
                    codeToExecute[this].setErrorMessage(error.message);
                    reporter.takeScreenShot(driver, screenShotPath, tasteeFileName, codeToExecute[this]);
                }.bind(idx));
            }
        }).then(function () {
            return codeToExecute;
        });
    };
    return TasteeEngine;
}());
exports.TasteeEngine = TasteeEngine;

//# sourceMappingURL=tastee-engine.js.map
