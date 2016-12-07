"use strict";
var tastee_core_1 = require("../../app/tastee-core");
var tastee_analyser_1 = require("../../app/tastee-analyser");
var tastee_engine_1 = require("../../app/tastee-engine");
require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser insyead of phantomjs (live testing)
require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
var fs = require("fs");
describe("Tastee Core Engine", function () {
    var core;
    beforeEach(function (done) {
        var engine = new tastee_engine_1.TasteeEngine('firefox', '.');
        core = new tastee_core_1.TasteeCore(engine, new tastee_analyser_1.TasteeAnalyser());
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./src/spec/examples/test-instructions.conf.tee', function () {
            core.addPluginFile('./plugin/common-instructions.conf.tee', function () {
                done();
            });
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
