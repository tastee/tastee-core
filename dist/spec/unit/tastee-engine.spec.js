"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_engine_1 = require("../../app/tastee-engine");
const instruction_1 = require("../../app/instruction");
////////  SPECS  /////////////
describe('Tastee Engine', function () {
    let engine;
    beforeEach(function () {
        engine = new tastee_engine_1.TasteeEngine(null);
        let browser = jasmine.createSpyObj("browser", ["close", "By"]);
        engine.browser = browser;
    });
    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.browser.close).toHaveBeenCalled();
    });
    it(" execute simple js code", function () {
        var sum = 0;
        engine.page = () => { sum = +1 + 1; };
        let instruction = new instruction_1.Instruction(1, 'a line', 'page();');
        engine.execute([instruction], "nameOfTasteeFile");
        expect(sum).toBe(2);
    });
});

//# sourceMappingURL=tastee-engine.spec.js.map
