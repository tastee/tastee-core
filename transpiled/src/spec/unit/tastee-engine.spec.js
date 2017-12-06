"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_engine_1 = require("../../app/tastee-engine");
const instruction_1 = require("../../app/instruction");
////////  SPECS  /////////////
describe('Tastee Engine', function () {
    let engine;
    beforeEach(function () {
        engine = new tastee_engine_1.TasteeEngine(null, '');
        let driver = jasmine.createSpyObj("driver", ["quit", "takeScreenshot"]);
        driver.takeScreenshot.and.returnValue(new Promise(function () { }));
        engine.driver = driver;
        engine.webdriver.promise = promise;
    });
    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.driver.quit).toHaveBeenCalled();
    });
    it(" execute simple js code", function () {
        var sum = 0;
        engine.webdriver.By = () => { sum = +1 + 1; };
        let instruction = new instruction_1.Instruction(1, 'a line', 'By();');
        engine.execute([instruction], "nameOfTasteeFile");
        expect(sum).toBe(2);
    });
});
let promise = {
    controlFlow() {
        return new Flow();
    }
};
class Flow {
    execute(callback) {
        this.jasmineCallback = callback;
        this.jasmineCallback('execute');
        return new Promise(this.jasmineCallback);
    }
}

//# sourceMappingURL=tastee-engine.spec.js.map
