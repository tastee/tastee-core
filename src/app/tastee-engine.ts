import { Instruction } from './instruction';
import { TasteeReporter } from './tastee-reporter';
declare var assert: any;
var assert = require('assert');

export class TasteeEngine {

    puppeteer = require('puppeteer');
    reporter: TasteeReporter;

    page: any;
    browser: any;
    headless = false;

    constructor(headlessMode: boolean = false) {
        this.reporter = new TasteeReporter();
        this.headless = headlessMode;
    }

    stop(): void {(async () => {
        await this.browser.close();
    })();
    }

    async execute(codeToExecute: Instruction[], tasteeFileName: string): Promise<Instruction[]> {
        if(!this.page){
            this.browser = await this.puppeteer.launch({headless: this.headless});
            this.page = await this.browser.newPage();
        }
        var page = this.page;
        var browser = this.browser;
        let reporter = this.reporter;
        for (var idx = 0; idx < codeToExecute.length; idx++) {
            try {
                await eval(codeToExecute[idx].command);
                await codeToExecute[idx].setValid(true);
            } catch (error) {
                console.log(error);
                await codeToExecute[idx].setValid(false);
                await codeToExecute[idx].setErrorMessage(error.message);
            }
        }
        return codeToExecute;
    }

}

