// assert for assertions in the tastee tests script
var assert = require("assert");

const webdriver = require("selenium-webdriver");
var Reporter = require('./tastee-reporter');

module.exports = {
    init(browser, path) {
        driver = new webdriver.Builder().forBrowser(browser).build();
        screenShotPath = path;
    },
    stop() {
        driver.quit();
    },
    execute(codeToExecute) {
        var By = webdriver.By;
        var ManagedPromise = webdriver.ManagedPromise;
        var flow = webdriver.promise.controlFlow();

        return flow.execute(function () {

            for (var idx = 0; idx < codeToExecute.length; idx++) {
                flow.execute(function () {
                    eval(codeToExecute[this].command);
                }.bind(idx)).then(function () {
                    codeToExecute[this].setValid(true);
                    Reporter.takeScreenShot(driver, screenShotPath, codeToExecute[this]);
                }.bind(idx), function (error) {
                    codeToExecute[this].setValid(false);
                    codeToExecute[this].setErrorMessage(error.message);
                    Reporter.takeScreenShot(driver, screenShotPath, codeToExecute[this]);
                }.bind(idx));
            }
        }).then(function () {
            return codeToExecute;
        });
    }
};
