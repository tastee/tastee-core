/* tslint:disable:no-unused-variable */

import { TasteeEngine } from "../../app/tastee-engine";
import { Instruction } from "../../app/instruction";

////////  SPECS  /////////////

describe('Tastee Engine', function () {
    let engine: TasteeEngine;

    beforeEach(function () {
        engine = new TasteeEngine(null);
        let browser = jasmine.createSpyObj("browser", ["close", "By"]);
        engine.browser = browser;
    });


    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.browser.close).toHaveBeenCalled();
    });

    it(" execute simple js code", function () {
        var sum = 0
        engine.page = () => { sum = +1 + 1; };

        let instruction = new Instruction(1, 'a line', 'page();');

        engine.execute([instruction], "nameOfTasteeFile");

        expect(sum).toBe(2);
    });

});