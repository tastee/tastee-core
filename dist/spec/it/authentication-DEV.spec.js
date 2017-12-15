"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tastee_core_1 = require("../../app/tastee-core");
const tastee_analyser_1 = require("../../app/tastee-analyser");
const tastee_engine_1 = require("../../app/tastee-engine");
var assert = require("assert");
const core = require('../../app/tastee-core');
var fs = require("fs");
describe("Tastee Core Engine", function () {
    let core;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let engine = new tastee_engine_1.TasteeEngine('phantomjs', './report');
        core = new tastee_core_1.TasteeCore(new tastee_analyser_1.TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./src/spec/examples/authentication/authentication.yaml', function () {
            core.addPluginFile('./plugin/common-instructions.yaml', () => {
                done();
            });
        });
        core.addParamFile('./src/spec/examples/my-parameters.parameters');
    });
    afterEach(function () {
        core.stop();
    });
    it("will test authentication with dev-like script", function (done) {
        fs.readFile("./src/spec/examples/authentication/authentication-DEV.html", "utf8", function (err, data) {
            core.execute(data).then(returnValue => {
                for (var idx = 0; idx < returnValue.length; idx++) {
                    assert.equal(returnValue[idx].valid, true, 'At line ' + returnValue[idx].lineNumber + ' : ' + returnValue[idx].errorMessage + '\n=>' + returnValue[idx]);
                }
            });
            return done();
        });
    });
});

//# sourceMappingURL=authentication-DEV.spec.js.map
