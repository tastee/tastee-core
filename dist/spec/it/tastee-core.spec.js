"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_core_1 = require("../../app/tastee-core");
const tastee_analyser_1 = require("../../app/tastee-analyser");
const tastee_engine_1 = require("../../app/tastee-engine");
var fs = require("fs");
describe("Tastee Core Engine", function () {
    let core;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        let engine = new tastee_engine_1.TasteeEngine('phantomjs', './report');
        core = new tastee_core_1.TasteeCore(new tastee_analyser_1.TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./plugin/common-instructions.yaml', function () {
            core.addPluginFile('./src/spec/examples/test-instructions.yaml', function () {
                done();
            });
        });
        core.addParamFile('./src/spec/examples/my-parameters.parameters');
    });
    afterEach(function () {
        core.stop();
    });
    it("will test a simple tastee script", function (done) {
        core.execute("go to 'https://en.wikipedia.org/wiki/Selenium'");
        let instructions = core.execute("check that '.firstHeading' is equal to 'Selenium'");
        if (instructions[0].valid) {
            done();
        }
    });
    it("will test a tastee script with parameters", function (done) {
        core.execute("go to wikipedia.Selenium");
        let instructions = core.execute("check that wikipedia.title is equal to selenium.title");
        if (instructions[0].valid) {
            done();
        }
    });
    it("will test a more complex tastee", function (done) {
        fs.readFile("./src/spec/examples/test-script.html", "utf8", function (err, data) {
            core.execute(data).then(instructions => {
                if (instructions.filter(instruction => !instruction.valid).length == 0) {
                    done();
                }
            });
        });
    });
});

//# sourceMappingURL=tastee-core.spec.js.map
