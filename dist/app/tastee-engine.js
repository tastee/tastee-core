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
    constructor(headlessMode = false) {
        this.puppeteer = require('puppeteer');
        this.headless = false;
        this.reporter = new tastee_reporter_1.TasteeReporter();
        this.headless = headlessMode;
    }
    stop() {
        (() => __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        }))();
    }
    execute(codeToExecute, tasteeFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page) {
                this.browser = yield this.puppeteer.launch({ headless: this.headless });
                this.page = yield this.browser.newPage();
            }
            var page = this.page;
            var browser = this.browser;
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
