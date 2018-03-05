import { TasteeCore } from "../../app/tastee-core";
import { TasteeAnalyser } from "../../app/tastee-analyser";
import { TasteeEngine } from "../../app/tastee-engine";

var assert = require("assert");

const core = require('../../app/tastee-core');
var fs = require("fs");

describe("Tastee Core Engine", function () {

    let core: TasteeCore;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        let engine = new TasteeEngine( false);
        core = new TasteeCore(new TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./plugin/common-instructions.yaml', () => {
            done();
        });
        core.addParamFile('./src/spec/examples/my-parameters.properties');
    });

    afterEach(function () {
        core.stop();
    })

    it("will test authentication with browser-like script", function (done) {

        fs.readFile("./src/spec/examples/authentication/authentication-BWR.html", "utf8", function (err, data) {

            core.execute(data).then(returnValue => {
                for (var idx = 0; idx < returnValue.length; idx++) {
                    assert.equal(returnValue[idx].valid, true, 'At line ' + returnValue[idx].lineNumber + ' : ' + returnValue[idx].errorMessage + '\n=>' + returnValue[idx]);
                }
                return done();
            });
        });
    })
});
