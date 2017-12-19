/* tslint:disable:no-unused-variable */

import { TasteeEngine } from "../../app/tastee-engine";
import { Instruction } from "../../app/instruction";

////////  SPECS  /////////////

describe('Tastee Engine', function () {
    let engine: TasteeEngine;

    beforeEach(function () {
        engine = new TasteeEngine(null);
        let driver = jasmine.createSpyObj("driver", ["quit"]);
        engine.driver = driver;
        engine.webdriver.promise = promise;
    });


    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.driver.quit).toHaveBeenCalled();
    });

    it(" execute simple js code", function () {
        var sum = 0
        engine.webdriver.By = () => { sum = +1 + 1; };

        let instruction = new Instruction(1, 'a line', 'By();');

        engine.execute([instruction], "nameOfTasteeFile");

        expect(sum).toBe(2);
    });

});

let promise = {
    controlFlow() {
        return new Flow();
    }
}

class Flow {
    jasmineCallback: any;

    execute(callback) {
        this.jasmineCallback = callback;
        this.jasmineCallback('execute');
        return new Promise(this.jasmineCallback);
    }
}