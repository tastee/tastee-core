

require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser insyead of phantomjs (live testing)
//require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
const core = require('../../app/tastee-core');
var fs = require("fs");

describe("Tastee Core Engine", function () {
    beforeAll(function (done) {
        //load asynchronous analyser, then launch tests
        core.loadAnalyser(done);
        core.addPluginFile("./spec/examples/test-instructions.conf.tee");
    });

    it("will test a simple tastee script", function () {
        core.init('phantomjs');
        core.execute('go to https://en.wikipedia.org/wiki/Selenium');
        core.execute('verify that firstHeading is Selenium');
        core.stop();
    });



    it("will test a tastee script with parameters", function () {
        core.init('phantomjs');
        core.addParamFile('./spec/examples/my-parameters.param.tee');
        core.execute('go to wikipedia.Selenium');
        core.execute('verify that wikipedia.title is selenium.title');
        core.stop();
    });

    it("will test a more complex tastee", function () {
        fs.readFile("./spec/examples/test-script.tee", "utf8", function (err, data) {
            core.init('phantomjs');
            core.execute(data);
            core.stop();
        });
    });

});
