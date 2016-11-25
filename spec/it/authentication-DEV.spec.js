var assert = require("assert");

require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser instead of phantomjs (live testing)
//require('geckodriver'); //in case of use firefox browser instead of phantomjs (live testing)
const core = require('../../app/tastee-core');
var fs = require("fs");

describe("Tastee Core Engine", function () {
    var callbacks;
    beforeAll(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //load asynchronous analyser, then launch tests
        core.loadAnalyser(function (){

        core.addPluginFile("./spec/examples/authentication/authentication.conf.tee");
        fs.readFile("./spec/examples/authentication/authentication-DEV.tee", "utf8", function (err, data) {

            core.init('phantomjs');
            core.execute(data).then(function (returnValue){
              callbacks = returnValue;
            return done();
            });
        });
      });
    });

    afterAll(function () {
      core.stop();
    });

    it("will test authentication with dev-like script", function () {
          for (var idx = 0; idx < callbacks.length; idx++) {
            assert.equal(callbacks[idx].valid, true, 'At line '+callbacks[idx].lineNumber+ ' : '+callbacks[idx].errorMessage);
          }
    })

});
