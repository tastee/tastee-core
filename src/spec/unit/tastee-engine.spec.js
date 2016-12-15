/* tslint:disable:no-unused-variable */
"use strict";
var tastee_engine_1 = require("../../app/tastee-engine");
var instruction_1 = require("../../app/instruction");
////////  SPECS  /////////////
describe('Tastee Engine', function () {
    var engine;
    beforeEach(function () {
        engine = new tastee_engine_1.TasteeEngine(null, '');
        engine.driver = jasmine.createSpyObj("driver", ["quit"]);
        engine.webdriver.promise = promise;
    });
    it(" quits selenium driver properly", function () {
        engine.stop();
        expect(engine.driver.quit).toHaveBeenCalled();
    });
    it(" execute simple js code", function () {
        var sum = 0;
        engine.webdriver.By = function () { sum = +1 + 1; };
        var instruction = new instruction_1.Instruction(1, 'a line', 'By();');
        engine.execute([instruction]);
        expect(sum).toBe(2);
    });
});
var promise = {
    controlFlow: function () {
        return new Flow();
    }
};
var Flow = (function () {
    function Flow() {
    }
    Flow.prototype.execute = function (callback) {
        this.jasmineCallback = callback;
        this.jasmineCallback('execute');
        return new Promise(this.jasmineCallback);
    };
    return Flow;
}());

//# sourceMappingURL=tastee-engine.spec.js.map
