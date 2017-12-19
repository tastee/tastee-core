/* tslint:disable:no-unused-variable */

import {TasteeEngine} from "../../app/tastee-engine";
import {Instruction} from "../../app/instruction";
import {TasteeCore} from "../../app/tastee-core";
import {TasteeReporter} from "../../app/tastee-reporter";

////////  SPECS  /////////////
var Reporter;
var builder;
var nameSpy;
var testCaseSpy;
var testSuite;
var classNameSpy;
var faillure;
var fs;
var path
var failSpy;
describe('Tastee Reporter', function () {
    let reporter:TasteeReporter;
    let tasteeAnalyser;
    let tasteeEngine;

    beforeEach(function () {
        reporter = new TasteeReporter();

        spyOn(console, 'log');


        failSpy = jasmine.createSpyObj('failure', ['failure']);

        nameSpy = jasmine.createSpyObj('name', ['name']);
        nameSpy.name.and.returnValue(failSpy);

        classNameSpy = jasmine.createSpyObj('className', ['className']);
        classNameSpy.className.and.returnValue(nameSpy);

        testCaseSpy = jasmine.createSpyObj('testCase', ['testCase']);
        testCaseSpy.testCase.and.returnValue(classNameSpy);

        testSuite = jasmine.createSpyObj('testSuite', ['name']);
        testSuite.name.and.returnValue(testCaseSpy);


        fs = jasmine.createSpyObj('fs', ['existsSync', 'mkdirSync'])
        path = jasmine.createSpyObj('path', ['join']);

    });

    it(" print all field into this", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(true);

        reporter.generateConsoleLog([instruction])

        expect(console.log).toHaveBeenCalledWith('1 => go to www.google.fr : true');
    });

    it(" print empty field if field is undefined this", function () {
        var instruction = new Instruction(1, '', '');
        instruction.setValid(true);

        reporter.generateConsoleLog([instruction])

        expect(console.log).toHaveBeenCalledWith('1 =>  : true');
    });

});
