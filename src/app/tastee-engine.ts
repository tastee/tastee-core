import {Instruction} from "./instruction";
import {TasteeReporter} from "./tastee-reporter";

declare var assert: any;
var assert = require('assert');

export class TasteeEngine {

    webdriver = require('selenium-webdriver');
    reporter:TasteeReporter;

    driver:any;
    screenShotPath:string;

    constructor(browser : any, path : string) {
        if(browser){
            this.driver = new this.webdriver.Builder().forBrowser(browser).build();
        }
        this.screenShotPath = path;
        this.reporter = new TasteeReporter();
    }

    stop() : void{
        this.driver.quit();
    }

    execute(codeToExecute : Instruction[],tasteeFileName : string) :  Promise<Instruction[]>{
        var By = this.webdriver.By;
        var Actions = this.webdriver.Actions;
        var ManagedPromise = this.webdriver.ManagedPromise;
        var flow = this.webdriver.promise.controlFlow();
        let screenShotPath = this.screenShotPath;
        let driver = this.driver;
        let reporter = this.reporter;

        return flow.execute(function () {

            for (var idx = 0; idx < codeToExecute.length; idx++) {

                flow.execute(function () {
                    eval(codeToExecute[this].command);
                }.bind(idx)).then(function () {
                    codeToExecute[this].setValid(true);
                    reporter.takeScreenShot(driver, screenShotPath, tasteeFileName,codeToExecute[this]);
                }.bind(idx), function (error) {
                    codeToExecute[this].setValid(false);
                    codeToExecute[this].setErrorMessage(error.message);
                    reporter.takeScreenShot(driver, screenShotPath,tasteeFileName, codeToExecute[this]);
                }.bind(idx));
            }
        }).then(function () {
            return codeToExecute;
        });
    }

}

