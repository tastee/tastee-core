import { TasteeCore } from "../../app/tastee-core";
import { TasteeAnalyser } from "../../app/tastee-analyser";
import { TasteeEngine } from "../../app/tastee-engine";
import { Instruction } from "app/instruction";

var fs = require("fs");

describe("Tastee Core Engine", function () {
    let core: TasteeCore;
    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        let engine = new TasteeEngine( false);
        core = new TasteeCore(new TasteeAnalyser());
        core.init(engine);
        //load asynchronous analyser, then launch tests
        core.addPluginFile('./plugin/common-instructions.yaml', function () {
            core.addPluginFile('./src/spec/examples/test-instructions.yaml', function () {
                done();
            });
        });
        core.addParamFile('./src/spec/examples/my-parameters.properties');
    });

    afterEach(function () {
        core.stop();
    })

    it("will test a simple tastee script", function (done) {
        core.execute("go to 'https://en.wikipedia.org/wiki/Selenium'").then(() => {
            core.execute("check that '.firstHeading' is equal to 'Selenium'").then(instructions => {
                if (instructions[0].valid) {
                    done();
                }
            });
        });
    });



    it("will test a tastee script with parameters", function (done) {
        core.execute("go to wikipedia.Selenium").then(() => {
            core.execute("check that wikipedia.title is equal to selenium.title").then(instructions => {
                if (instructions[0].valid) {
                    done();
                }
            });
        });
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
