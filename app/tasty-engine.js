// assert for assertions in the tasty tests script
var assert = require("assert"),
    webdriver = require("selenium-webdriver");

var driver;

module.exports = {
    init(browser) {
        driver = new webdriver.Builder().forBrowser(browser).build();
    },
    stop () {
        driver.quit();
    },
    execute (codeToExecute) {
        // By for selectors in the tasty tests script
        var By = webdriver.By;   

        eval(codeToExecute);
    }
};