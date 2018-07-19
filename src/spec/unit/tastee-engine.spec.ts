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

        engine.execute([instruction], "nameOfTasteeFile").then(result => {
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(true);
            done();
        });
    });
});
