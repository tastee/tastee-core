

require('phantomjs-prebuilt');
//require('chromedriver'); //in case of use chrome browser insyead of phantomjs (live testing)
const core = require('../../app/tasty-core'); 
var fs = require("fs");
  
describe("Tasty Core Engine", function() {
    beforeAll(function(done){
        //load asynchronous analyser, then launch tests
        core.loadAnalyser(done);  
        core.addPluginFile("./spec/examples/test-instructions.conf.tty");
    });
    
    it("will test a simple tasty script", function() {
        core.init('phantomjs');  
        core.execute('go to https://en.wikipedia.org/wiki/Selenium');
        core.execute('verify that firstHeading is Selenium');
        core.stop();
    });
    
    
    
    it("will test a tasty script with parameters", function() {
        core.init('phantomjs');  
        core.addParamFile('./spec/examples/my-parameters.param.tty');
        core.execute('go to wikipedia.Selenium');
        core.execute('verify that wikipedia.title is selenium.title');
        core.stop();
    });

    it("will test a more complex tasty", function() {
        fs.readFile("./spec/examples/test-script.tty", "utf8", function (err, data) {
            core.init('phantomjs');  
            core.execute(data);
            core.stop();
        });
    });

});
