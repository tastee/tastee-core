/* tslint:disable:no-unused-variable */
"use strict";
var tastee_core_1 = require("../../app/tastee-core");
////////  SPECS  /////////////
describe('Tastee Core', function () {
    var core;
    var tasteeAnalyser;
    var tasteeEngine;
    var someCallback = function () { };
    beforeEach(function () {
        tasteeAnalyser = jasmine.createSpyObj("TasteeAnalyser", ["addPluginFile", "addParamFile", "toSeleniumCode"]);
        tasteeEngine = jasmine.createSpyObj("TasteeEngine", ["stop", "execute"]);
        core = new tastee_core_1.TasteeCore(tasteeAnalyser, someCallback);
        core.init(tasteeEngine);
    });
    it(" inits analyser with the common plugin file", function () {
        expect(core.analyser.addPluginFile).toHaveBeenCalledWith('./plugin/common-instructions.conf.tee', someCallback);
    });
    it(" can add more plugin file", function () {
        var someCallback = function () { };
        var filePath = '/some/path';
        core.addPluginFile(filePath, someCallback);
        expect(core.analyser.addPluginFile).toHaveBeenCalledWith(filePath, someCallback);
    });
    it(" can add parameter file", function () {
        var filePath = '/some/path';
        core.addParamFile(filePath);
        expect(core.analyser.addParamFile).toHaveBeenCalledWith(filePath);
    });
    it(" can init the engine", function () {
        expect(core.engine).toEqual(tasteeEngine);
    });
    it(" can stop the engine", function () {
        core.stop();
        expect(core.engine.stop).toHaveBeenCalled();
    });
    it(" translate tastee code and execute it", function () {
        var tasteeCode = "line1\nline2";
        var executableCode = [];
        tasteeAnalyser.toSeleniumCode.and.returnValue(executableCode);
        core.execute(tasteeCode, "nameOfTasteeFile");
        expect(tasteeAnalyser.toSeleniumCode).toHaveBeenCalledWith(["line1", "line2"]);
        expect(tasteeEngine.execute).toHaveBeenCalledWith(executableCode, "nameOfTasteeFile");
    });
});

//# sourceMappingURL=tastee-core.spec.js.map
