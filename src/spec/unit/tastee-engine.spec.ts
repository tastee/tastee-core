/* tslint:disable:no-unused-variable */

import { TasteeEngine } from "../../app/tastee-engine";
import { Instruction } from "../../app/instruction";

import * as logger from "winston";
////////  SPECS  /////////////

describe('Tastee Engine', function () {
    let engine: TasteeEngine;

    logger.configure({
        level: 'debug',
        transports: [
            new logger.transports.Console({
                colorize: true
            })
        ]
    });

    beforeEach(function () {
        engine = new TasteeEngine(null);
        let driver = jasmine.createSpyObj("driver", ["quit"]);
        engine.driver = driver;
    });


    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.driver.quit).toHaveBeenCalled();
    });

    it(" execute simple js code", (done) => {
        let instruction = new Instruction(1, 'a line', '1+1');

        let promise = engine.execute([instruction], "nameOfTasteeFile");
        promise.then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(true);
            done();
        });
    });

    it(" execute empty codeLines", (done) => {
        let instruction = new Instruction(1, 'a line', '');

        engine.execute([instruction], "nameOfTasteeFile").then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(true);
            done();
        });
    });

    it(" execute unknown instruction", (done) => {
        let instruction = new Instruction(1, 'a line', 'bad code line');

        engine.execute([instruction], "nameOfTasteeFile").then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(false);
            done();
        });
    });

    it(" execute promise error", (done) => {
        let instruction = new Instruction(1, 'a line', 'throw new Error("exception!");');

        engine.execute([instruction], "nameOfTasteeFile").then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(false);
            done();
        });
    });
});
