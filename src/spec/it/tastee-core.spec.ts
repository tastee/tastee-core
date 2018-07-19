import { TasteeCore } from "../../app/tastee-core";
import { TasteeAnalyser } from "../../app/tastee-analyser";
import { TasteeEngine } from "../../app/tastee-engine";

var fs = require("fs");

describe("Tastee Core Engine", function () {
    let core: TasteeCore;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        const engine = new TasteeEngine('phantomjs', true);
        core = new TasteeCore(new TasteeAnalyser());
        core.init(engine);
        core.addPluginFile('./plugin/common-instructions.yaml');
        core.addPluginFile('./src/spec/examples/test-instructions.yaml');
        core.addParamFile('./src/spec/examples/my-parameters.properties');
    });

    afterEach(function () {
        core.stop();
    })

    it("will test a simple tastee script", function (done) {
        const instructions = [
            "go to 'https://en.wikipedia.org/wiki/Selenium'",
            "check that '.firstHeading' is equal to 'Selenium'"
        ];

        core.execute(instructions.join('\n')).then(result => {
            if (result.some(i => !i.valid)) {
                fail();
            } else {
                done();
            }
        });
    });

    it("will test a tastee script with parameters", function (done) {
        let instructions = [
            "go to wikipedia.Selenium",
            "check that wikipedia.title is equal to selenium.title"
        ];
        core.execute(instructions.join('\n')).then(result => {
            if (result.some(i => !i.valid)) {
                fail();
            } else {
                done();
            }
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
