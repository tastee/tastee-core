
require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser instead of phantomjs (live testing)
//require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
const core = require('../../app/tastee-core');
var fs = require("fs");

describe("Tastee Core Engine", function () {
    beforeAll(function (done) {
        //load asynchronous analyser, then launch tests
        core.loadAnalyser(done);
        core.addPluginFile("./spec/examples/authentication/authentication.conf.tee");
  });

    it("will test authentication with dev-like script", function () {
        fs.readFile("./spec/examples/authentication/authentication-DEV.tee", "utf8", function (err, data) {
            core.init('phantomjs');
            core.execute(data);
            core.stop();
        });
    });

});
