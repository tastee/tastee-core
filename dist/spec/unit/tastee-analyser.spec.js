"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
////////  SPECS  /////////////
const tastee_analyser_1 = require("../../app/tastee-analyser");
describe('Tastee Analyser', function () {
    let analyser;
    let callbackCalled = false;
    beforeEach((done) => {
        analyser = new tastee_analyser_1.TasteeAnalyser();
        analyser.addPluginFile('./src/spec/examples/test-instructions.yaml', function () {
            analyser.addPluginFile('./plugin/common-instructions.yaml', () => {
                callbackCalled = true;
                done();
            });
        });
        analyser.addParamFile('./src/spec/examples/my-parameters.properties');
    });
    it('manages call back after plugin added', () => {
        expect(callbackCalled).toBe(true);
    });
    it("Add tastee code file as plugin - go to - verify paramters", function () {
        expect(analyser.tasteeCodes[4].parameters[0]).toBe('$url');
    });
    it("Add tastee code file as plugin - click on - verify codeLines", function () {
        expect(analyser.tasteeCodes[5].codeLines[0]).toBe('page.waitForSelector($name);');
    });
    it("Translate tastee code to selenium code - go to", function () {
        var instructions = analyser.toJsCode(["go to 'http://www.google.fr'"]);
        expect(instructions.length).toBe(1);
        expect(instructions[0].command).toBe("page.goto('http://www.google.fr');");
        expect(instructions[0].tasteeLine).toBe("go to 'http://www.google.fr'");
    });
    it("Translate tastee code to selenium code - verify", function () {
        var instructions = analyser.toJsCode(["check that 'myField' is equal to 'myValue'"]);
        expect(instructions[0].command).toBe("page.$eval('myField', e => e.innerHTML).then(html => { assert.equal(html, 'myValue', 'the '+ 'myField' + ' element contains '+html); });");
    });
    it("Translate using parameters", function () {
        var instructions = analyser.toJsCode(['check that param.field is equal to param.value']);
        expect(instructions[0].command).toBe("page.$eval('myField', e => e.innerHTML).then(html => { assert.equal(html, 'myValue', 'the '+ 'myField' + ' element contains '+html); });");
    });
    it("manage multiple occurences of function parameters when translating", function () {
        var instructions = analyser.toJsCode(["log some 'thisValue' twice"]);
        expect(instructions[0].command).toBe("console.log('log once '+'thisValue'+', and twice '+'thisValue');");
    });
    it("manage multiple occurences of external parameters when translating", function () {
        var instructions = analyser.toJsCode(['check that param.field is equal to param.field']);
        expect(instructions[0].command).toBe("page.$eval('myField', e => e.innerHTML).then(html => { assert.equal(html, 'myField', 'the '+ 'myField' + ' element contains '+html); });");
    });
    it("manages intructions that call other instruction", function () {
        //see ./spec/examples/test-instructions.yaml
        var instructions = analyser.toJsCode(['call go to google']);
        expect(instructions[0].command).toBe("page.goto('http://www.google.fr');");
    });
    it("manages intructions that call other instruction and parameters", function () {
        //see ./spec/examples/test-instructions.yaml
        var instructions = analyser.toJsCode(["call go to 'http://www.google.fr'"]);
        expect(instructions[0].command).toBe("page.goto('http://www.google.fr');");
    });
    it("manages intructions that call parameters", function () {
        //see ./spec/examples/test-instructions.yaml
        var instructions = analyser.toJsCode(["visit selenium wikipedia"]);
        expect(instructions[0].command).toBe("page.goto('https://en.wikipedia.org/wiki/Selenium');");
    });
    it("do not mix similar parameters", function () {
        //see ./spec/examples/my-parameters.properties
        var instructions = analyser.toJsCode(["complete.first.task"]);
        expect(instructions[0].command).toBe("'good'");
    });
});

//# sourceMappingURL=tastee-analyser.spec.js.map
