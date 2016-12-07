import {TasteeCore} from "../../app/tastee-core";
import {TasteeAnalyser} from "../../app/tastee-analyser";
import {TasteeEngine} from "../../app/tastee-engine";

var assert = require("assert");

require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser instead of phantomjs (live testing)
//require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
const core = require('../../app/tastee-core');
var fs = require("fs");

describe("Tastee Core Engine", function () {

    let core:TasteeCore;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        let engine = new TasteeEngine('firefox', './report');
        core = new TasteeCore(engine, new TasteeAnalyser());
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./plugin/common-instructions.conf.tee', () => {
            done();
        });
        core.addParamFile('./src/spec/examples/my-parameters.param.tee');
    });

    afterEach(function () {
        core.stop();
    })

    it("will test authentication with browser-like script", function (done) {

        fs.readFile("./src/spec/examples/authentication/authentication-BWR.tee", "utf8", function (err, data) {

            core.execute(data).then(function (returnValue){
                for (var idx = 0; idx < returnValue.length; idx++) {
                    assert.equal(returnValue[idx].valid, true, 'At line '+returnValue[idx].lineNumber+ ' : '+returnValue[idx].errorMessage + '\n=>' + returnValue[idx] );
                }
                return done();
            });
        });

    })

});
