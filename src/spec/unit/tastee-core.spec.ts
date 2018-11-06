/* tslint:disable:no-unused-variable */

import {TasteeEngine} from "../../app/tastee-engine";
import {TasteeCore} from "../../app/tastee-core";

////////  SPECS  /////////////

describe('Tastee Core', function () {
    let core:TasteeCore;
    let tasteeAnalyser;
    let tasteeEngine;
    let someCallback = () => {};

    beforeEach(function () {
        tasteeAnalyser = jasmine.createSpyObj("TasteeAnalyser", ["addPluginFile", "addParamFile", "toSeleniumCode", "init"]);
        tasteeEngine = jasmine.createSpyObj("TasteeEngine", ["stop", "execute"]);
        core = new TasteeCore(tasteeAnalyser);
        core.init(tasteeEngine);
    });

    it(" can add more plugin file", function () {
        let someCallback = () => {};
        let filePath = '/some/path';

        core.addPluginFile(filePath, someCallback);

        expect(core.analyser.addPluginFile).toHaveBeenCalledWith(filePath, someCallback);
    });

    it(" can add parameter file", function () {
        let filePath = '/some/path';

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
        let tasteeCode = "line1\nline2";
        let executableCode = [];

        tasteeAnalyser.toSeleniumCode.and.returnValue(executableCode);

        core.execute(tasteeCode);

        expect(tasteeAnalyser.toSeleniumCode).toHaveBeenCalledWith(["line1","line2"]);
        expect(tasteeEngine.execute).toHaveBeenCalledWith(executableCode);
    });

});
