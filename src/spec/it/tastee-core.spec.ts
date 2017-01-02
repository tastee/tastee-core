import {TasteeCore} from "../../app/tastee-core";
import {TasteeAnalyser} from "../../app/tastee-analyser";
import {TasteeEngine} from "../../app/tastee-engine";

var fs = require("fs");

describe("Tastee Core Engine", function () {
    let core:TasteeCore;

    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        let engine = new TasteeEngine('phantomjs', './report');
        core = new TasteeCore(new TasteeAnalyser(), function(){
            core.init(engine);
            core.addParamFile('./src/spec/examples/my-parameters.param.tee');
            //load asynchronous analyser, then launch tests
            core.addPluginFile('./src/spec/examples/test-instructions.conf.tee', function(){
                done();
            });
        });
    });

    afterEach(function () {
        core.stop();
    })

    it("will test a simple tastee script", function (done) {
        core.execute("go to 'https://en.wikipedia.org/wiki/Selenium'");
        core.execute("check that '.firstHeading' is equal to 'Selenium'").then(function (){
            done();
        });
    });



    it("will test a tastee script with parameters", function (done) {
        core.execute("go to wikipedia.Selenium");
        core.execute("check that wikipedia.title is equal to selenium.title").then(function (){
            done();
        });
    });

    it("will test a more complex tastee", function (done) {
        fs.readFile("./src/spec/examples/test-script.tee", "utf8", function (err, data) {
            core.execute(data).then(function (){
                done();
            });
        });
    });

});
