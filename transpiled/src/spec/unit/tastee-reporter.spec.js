"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
const instruction_1 = require("../../app/instruction");
const tastee_reporter_1 = require("../../app/tastee-reporter");
////////  SPECS  /////////////
var Reporter;
var builder;
var nameSpy;
var testCaseSpy;
var testSuite;
var classNameSpy;
var faillure;
var fs;
var path;
var failSpy;
describe('Tastee Reporter', function () {
    let reporter;
    let tasteeAnalyser;
    let tasteeEngine;
    beforeEach(function () {
        reporter = new tastee_reporter_1.TasteeReporter();
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
        //spyOn(builder, 'testSuite')
        builder = jasmine.createSpyObj('builder', ['testSuite', 'writeTo']);
        builder.testSuite.and.returnValue(testSuite);
        fs = jasmine.createSpyObj('fs', ['existsSync', 'mkdirSync']);
        path = jasmine.createSpyObj('path', ['join']);
        reporter.builder = builder;
    });
    it(" print all field into this", function () {
        var instruction = new instruction_1.Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(true);
        reporter.generateConsoleLog([instruction]);
        expect(console.log).toHaveBeenCalledWith('1 => go to www.google.fr : true');
    });
    it(" print empty field if field is undefined this", function () {
        var instruction = new instruction_1.Instruction(1, '', '');
        instruction.setValid(true);
        reporter.generateConsoleLog([instruction]);
        expect(console.log).toHaveBeenCalledWith('1 =>  : true');
    });
    it(" generate junit reporter with valid instructions", function () {
        var instruction = new instruction_1.Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(true);
        reporter.generateJunitReporter([instruction]);
        expect(builder.writeTo).toHaveBeenCalledWith('tastee-reporter-junit.xml');
        expect(builder.testSuite).toHaveBeenCalled();
        expect(classNameSpy.className).toHaveBeenCalled();
        expect(testSuite.name).toHaveBeenCalledWith('My Tastee It');
        expect(nameSpy.name).toHaveBeenCalledWith('go to www.google.fr');
    });
    it(" generate junit reporter with failed instructions", function () {
        var instruction = new instruction_1.Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');
        var instructions = [instruction];
        reporter.generateJunitReporter(instructions);
        expect(builder.writeTo).toHaveBeenCalledWith('tastee-reporter-junit.xml');
        expect(builder.testSuite).toHaveBeenCalled();
        expect(classNameSpy.className).toHaveBeenCalled();
        expect(testSuite.name).toHaveBeenCalledWith('My Tastee It');
        expect(nameSpy.name).toHaveBeenCalledWith('go to www.google.fr');
        expect(failSpy.failure).toHaveBeenCalledWith('error');
    });
    it(" not take screenshot if path is undefined", function () {
        var instruction = new instruction_1.Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');
        var driver = jasmine.createSpyObj('driver', ['takeScreenshot']);
        driver.takeScreenshot.and.callThrough();
        reporter.takeScreenShot(driver, undefined, undefined, instruction);
        expect(driver.takeScreenshot).not.toHaveBeenCalled();
    });
    it(" take screenshot if path is defined", function () {
        var instruction = new instruction_1.Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');
        var promise = jasmine.createSpyObj('promise', ['then']);
        promise.then.and.callThrough();
        var driver = jasmine.createSpyObj('driver', ['takeScreenshot']);
        driver.takeScreenshot.and.returnValue(promise);
        reporter.takeScreenShot(driver, '/tmp', undefined, instruction);
        expect(driver.takeScreenshot).toHaveBeenCalled();
    });
});

//# sourceMappingURL=tastee-reporter.spec.js.map
