"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_engine_1 = require("../../app/tastee-engine");
const instruction_1 = require("../../app/instruction");
const logger = require("winston");
////////  SPECS  /////////////
describe('Tastee Engine', function () {
    let engine;
    logger.configure({
        level: 'debug',
        transports: [
            new logger.transports.Console({
                colorize: true
            })
        ]
    });
    beforeEach(function () {
        engine = new tastee_engine_1.TasteeEngine(null);
        let driver = jasmine.createSpyObj("driver", ["quit"]);
        engine.driver = driver;
    });
    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.driver.quit).toHaveBeenCalled();
    });
    it(" execute simple js code", (done) => {
        let instruction = new instruction_1.Instruction(1, 'a line', '1+1');
        engine.execute([instruction], "nameOfTasteeFile").then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(true);
            done();
        });
    });
});

//# sourceMappingURL=tastee-engine.spec.js.map
