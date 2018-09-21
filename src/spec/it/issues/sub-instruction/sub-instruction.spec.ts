import { TasteeCore } from "../../../../app/tastee-core";
import { TasteeAnalyser } from "../../../../app/tastee-analyser";
import { TasteeEngine } from "../../../../app/tastee-engine";

var assert = require("assert");
var fs = require("fs");

fdescribe("Tastee Core Engine", function () {

    let core: TasteeCore;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        let engine = new TasteeEngine('firefox', true);
        core = new TasteeCore(new TasteeAnalyser());
        core.init(engine);


        core.addParamFile('./src/spec/it/issues/sub-instruction/keys.properties');
        core.addPluginFile('./src/spec/it/issues/sub-instruction/instruction.yaml', function () {
            core.addPluginFile('./src/spec/it/issues/sub-instruction/sub-instruction.yaml', () => {
                done();
            });
        });
    });

    afterEach(function () {
        core.stop();
    })

    fit("will test authentication with fonctional-like script", function (done) {

        fs.readFile("./src/spec/it/issues/sub-instruction/sub-instruction.html", "utf8", function (err, data) {
            console.log(data);
            core.execute(data).then(returnValue => {
                for (var idx = 0; idx < returnValue.length; idx++) {
                    assert.equal(returnValue[idx].valid, true, 'At line ' + returnValue[idx].lineNumber + ' : ' + returnValue[idx].errorMessage + '\n=>' + returnValue[idx]);
                    return done();
                }
            });
        });

    })

});
