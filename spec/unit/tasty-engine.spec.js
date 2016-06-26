var mock = require('mock-require');
var Instruction = require('../../app/instruction');

var engine;

var buildCalled = false;
var stopCalled = false;

describe("Tasty Engine", function () {
    beforeAll(function () {
        mock('selenium-webdriver', "./mock/mockSeleniumDriver");
        mock('junit-report-builder', require("./mock/mockJunitReporter"));
        engine = require('../../app/tasty-engine');
    });

    beforeEach(function () {
        engine.init(function (method) {
            buildCalled = (method === 'forBrowser');
            stopCalled = (method === 'quit');
            executeCalled = (method === 'execute');
        });
    });

    afterAll(function () {
        mock.stopAll();
    });

    it(" inits selenium driver", function () {
        expect(buildCalled).toBe(true);
    });

    it(" stops selenium driver", function () {
        engine.stop();
        expect(stopCalled).toBe(true);
    });

    it(" executes code", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        var instructions = [instruction];
        engine.execute(instructions);
    });
});