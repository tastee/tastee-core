"use strict";
var tastee_core_1 = require("../../app/tastee-core");
var tastee_analyser_1 = require("../../app/tastee-analyser");
var tastee_engine_1 = require("../../app/tastee-engine");
var assert = require("assert");
//require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser instead of phantomjs (live testing)
require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
var core = require('../../app/tastee-core');
var fs = require("fs");
describe("Onema", function () {
    var core;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        var engine = new tastee_engine_1.TasteeEngine('firefox', './report');
        core = new tastee_core_1.TasteeCore(engine, new tastee_analyser_1.TasteeAnalyser());
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./src/spec/examples/onema.conf.tee', function () {
            core.addPluginFile('./plugin/common-instructions.conf.tee', function () {
                done();
            });
        });
    });
    afterEach(function () {
        core.stop();
    });
    fit("my first test", function (done) {
        fs.readFile("./src/spec/examples/onema.tee", "utf8", function (err, data) {
            core.execute(data).then(function (returnValue) {
                for (var idx = 0; idx < returnValue.length; idx++) {
                    assert.equal(returnValue[idx].valid, true, 'At line ' + returnValue[idx].lineNumber + ' : ' + returnValue[idx].errorMessage + '\n=>' + returnValue[idx]);
                }
                return done();
            });
        });
    });
});

//# sourceMappingURL=onema.spec.js.map
