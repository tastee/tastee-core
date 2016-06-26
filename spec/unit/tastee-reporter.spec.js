var mock = require('mock-require');

var Instruction = require('../../app/instruction');

var Reporter;
var builder;
var nameSpy;
var testCaseSpy;
var testSuite;
var classNameSpy;
var faillure;
var fs;
var path
describe("tastee Reporter", function () {

    beforeAll(function () {
        mock('junit-report-builder', require("./mock/mockJunitReporter"));
        mock('fs');
        mock('path');
        builder = require('junit-report-builder');
        Reporter = require('../../app/tastee-reporter')
    });

    beforeEach(function () {
        failSpy = jasmine.createSpyObj('failure', ['failure']);

        nameSpy = jasmine.createSpyObj('name', ['name']);
        nameSpy.name.and.returnValue(failSpy);

        classNameSpy = jasmine.createSpyObj('className', ['className']);
        classNameSpy.className.and.returnValue(nameSpy);

        testCaseSpy = jasmine.createSpyObj('testCase', ['testCase']);
        testCaseSpy.testCase.and.returnValue(classNameSpy);

        testSuite = jasmine.createSpyObj('testSuite', ['name']);
        testSuite.name.and.returnValue(testCaseSpy);


        spyOn(builder, 'testSuite').and.returnValue(testSuite);
        spyOn(builder, 'writeTo');
        spyOn(console, 'log');
        fs = jasmine.createSpyObj('fs', ['existsSync', 'mkdirSync'])
        path = jasmine.createSpyObj('path', ['join'])

    });

    afterAll(function () {
        mock.stopAll();
    });

    it(" print all field into this", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(true);
        var instructions = [instruction];

        Reporter.generateConsoleLog(instructions)

        expect(console.log).toHaveBeenCalledWith('1 => go to www.google.fr : true');

    });

    it(" print empty field if field is undefined this", function () {
        var instruction = new Instruction(1);
        instruction.setValid(true);
        instruction.setValid(true);
        var instructions = [instruction];

        Reporter.generateConsoleLog(instructions)

        expect(console.log).toHaveBeenCalledWith('1 =>  : true');

    });

    it(" generate junit reporter with valid instructions", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(true);
        var instructions = [instruction];

        Reporter.generateJunitReporter(instructions)

        expect(builder.writeTo).toHaveBeenCalledWith('tastee-reporter-junit.xml');
        expect(builder.testSuite).toHaveBeenCalled();
        expect(classNameSpy.className).toHaveBeenCalled();
        expect(testSuite.name).toHaveBeenCalledWith('My Tastee It');
        expect(nameSpy.name).toHaveBeenCalledWith('go to www.google.fr');

    });

    it(" generate junit reporter with failed instructions", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');

        var instructions = [instruction];

        Reporter.generateJunitReporter(instructions)

        expect(builder.writeTo).toHaveBeenCalledWith('tastee-reporter-junit.xml');
        expect(builder.testSuite).toHaveBeenCalled();
        expect(classNameSpy.className).toHaveBeenCalled();
        expect(testSuite.name).toHaveBeenCalledWith('My Tastee It');
        expect(nameSpy.name).toHaveBeenCalledWith('go to www.google.fr');
        expect(failSpy.failure).toHaveBeenCalledWith('error');

    });

    it(" not take screenshot if path is undefined", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');

        var driver = jasmine.createSpyObj('driver', ['takeScreenshot'])
        driver.takeScreenshot.and.callThrough();

        Reporter.takeScreenShot(driver, undefined, instruction)
        expect(driver.takeScreenshot).not.toHaveBeenCalled();


    });

    it(" take screenshot if path is defined", function () {
        var instruction = new Instruction(1, "go to www.google.fr", "expect(true).toBe(true);");
        instruction.setValid(false);
        instruction.setErrorMessage('error');

        var promise = jasmine.createSpyObj('promise', ['then'])
        promise.then.and.callThrough();

        var driver = jasmine.createSpyObj('driver', ['takeScreenshot'])
        driver.takeScreenshot.and.returnValue(promise);

        Reporter.takeScreenShot(driver, '/tmp', instruction)
        expect(driver.takeScreenshot).toHaveBeenCalled();


    });

});