"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tastee_core_1 = require("../../app/tastee-core");
var tastee_analyser_1 = require("../../app/tastee-analyser");
var tastee_engine_1 = require("../../app/tastee-engine");
var fs = require("fs");
describe("Tastee Core Engine", function () {
    var core;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        var engine = new tastee_engine_1.TasteeEngine('phantomjs', './report');
        core = new tastee_core_1.TasteeCore(new tastee_analyser_1.TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./src/spec/examples/test-instructions.conf.tee', function () {
            done();
        });
        core.addParamFile('./src/spec/examples/my-parameters.param.tee');
    });
    afterEach(function () {
        core.stop();
    });
    it("will test a simple tastee script", function (done) {
        core.execute("go to 'https://en.wikipedia.org/wiki/Selenium'");
        core.execute("check that '.firstHeading' is equal to 'Selenium'").then(function () {
            done();
        });
    });
    it("will test a tastee script with parameters", function (done) {
        core.execute("go to wikipedia.Selenium");
        core.execute("check that wikipedia.title is equal to selenium.title").then(function () {
            done();
        });
    });
    it("will test a more complex tastee", function (done) {
        fs.readFile("./src/spec/examples/test-script.tee", "utf8", function (err, data) {
            core.execute(data).then(function () {
                done();
            });
        });
    });
});

//# sourceMappingURL=tastee-core.spec.js.map
