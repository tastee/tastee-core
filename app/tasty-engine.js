// assert for assertions in the tasty tests script
var assert = require("assert");
const webdriver = require("selenium-webdriver");


module.exports = {
    init(browser) {
        driver = new webdriver.Builder().forBrowser(browser).build();
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
                }.bind(idx), function () {
                    codeToExecute[this].setValid(false);
                }.bind(idx));
            }
        }).then(function () {
            return codeToExecute;
        });
    }
};