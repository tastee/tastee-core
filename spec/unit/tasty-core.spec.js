var mock = require('mock-require');

var engine;
var analyser;
var core; 
describe("Tasty Core Engine", function() {
    var toSeleniumCodeSpy;

    beforeAll(function() {
        mock('../../app/tasty-analyser', { 
            addPluginFile: function(file) { },
            addParamFile: function(file) { },
            toSeleniumCode: function(tastyCode) { }
        });
        mock('../../app/tasty-engine', { 
            init: function(browser,screenShotPath) { },
            stop: function() { },
            execute: function(seleniumCode) { }
        });

        engine = require('../../app/tasty-engine');
        analyser = require('../../app/tasty-analyser');
        core = require('../../app/tasty-core');
    });

    beforeEach(function() {
       spyOn(analyser, 'addPluginFile');
       spyOn(analyser, 'addParamFile');
       toSeleniumCodeSpy = spyOn(analyser, "toSeleniumCode").and.returnValue('seleniumCode');
       spyOn(engine, 'init');
       spyOn(engine, 'stop');
       spyOn(engine, 'execute');
    });

    afterAll(function() {
        mock.stopAll();
        mock.stop('../../app/tasty-engine.js');
    });
    
    it("will load plugin at construction", function() {
        var callback = function(){};
        core.loadAnalyser(callback);
        expect(analyser.addPluginFile).toHaveBeenCalledWith('./plugin/common-instructions.conf.tty', callback);
    });

    it("will add plugin files", function() {
        core.addPluginFile("./a/file");
        expect(analyser.addPluginFile).toHaveBeenCalledWith("./a/file");
    });
    
    it(" call init to init browser", function() {
        core.init('firefox','/tmp');
        
        expect(engine.init).toHaveBeenCalledWith('firefox','/tmp');
    });
    
    it(" stops the engine", function() {
        core.stop();
        
        expect(engine.stop).toHaveBeenCalled();
    });
    
    it(" translate and execute", function() {
        core.execute('tastyCode');
        
        expect(analyser.toSeleniumCode).toHaveBeenCalledWith(['tastyCode']);
        expect(engine.execute).toHaveBeenCalledWith('seleniumCode');
    });
    
     it(" adds param files", function() {
        core.addParamFile('aFile');
        
        expect(analyser.addParamFile).toHaveBeenCalledWith('aFile');
    });

    it(" translate and execute with errors", function() {
        toSeleniumCodeSpy.and.throwError("expected error on test");

        core.execute('tastyCode');
        
        expect(analyser.toSeleniumCode).toHaveBeenCalledWith(['tastyCode']);
        expect(engine.execute).not.toHaveBeenCalledWith('seleniumCode');
    });
});