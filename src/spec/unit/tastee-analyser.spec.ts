/* tslint:disable:no-unused-variable */

////////  SPECS  /////////////

import {TasteeAnalyser} from "../../app/tastee-analyser";

describe('Tastee Analyser', function () {

    let analyser : TasteeAnalyser;
    let callbackCalled = false;

    beforeEach((done) => {
        analyser = new TasteeAnalyser();
        analyser.addPluginFile('./src/spec/examples/test-instructions.yaml', function(){
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

    it("Add tastee code file as plugin - go to - verify paramters", function() {
        expect(analyser.tasteeCodes[3].parameters[0]).toBe('$url');
    });

    it("Add tastee code file as plugin - click on - verify codeLines", function() {
        expect(analyser.tasteeCodes[4].codeLines[0]).toBe('driver.findElement(By.css($name)).click();');
    });

    it("Translate tastee code to selenium code - go to", function() {
        var instructions = analyser.toSeleniumCode(["go to 'http://www.google.fr'"]);
        expect(instructions.length).toBe(1);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
        expect(instructions[0].tasteeLine).toBe("go to 'http://www.google.fr'");
    });

    it("Translate tastee code to selenium code - verify", function() {
        var instructions = analyser.toSeleniumCode(["check that 'myField' is equal to 'myValue'"]);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('myField'));\n"+
            "element.getText().then(function(text) { assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text); });");
    });

    it("Translate using parameters", function() {
        var instructions = analyser.toSeleniumCode(['check that param.field is equal to param.value']);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('myField'));\n"+
            "element.getText().then(function(text) { assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text); });");
    });

    it("manage multiple occurences of function parameters when translating", function() {
        var instructions = analyser.toSeleniumCode(["log some 'thisValue' twice"]);
        expect(instructions[0].command).toBe("console.log('log once '+'thisValue'+', and twice '+'thisValue');");
    });

    it("manage multiple occurences of external parameters when translating", function() {
        var instructions = analyser.toSeleniumCode(['check that param.field is equal to param.field']);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('myField'));\n"+
            "element.getText().then(function(text) { assert.equal(text, 'myField', 'the '+ 'myField' + ' element contains '+text); });");
    });

    it("manages intructions that call other instruction", function() {
        //see ./spec/examples/test-instructions.yaml
        var instructions = analyser.toSeleniumCode(['call go to google']);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
    });

    it("manages intructions that call other instruction and parameters", function() {
        //see ./spec/examples/test-instructions.yaml
        var instructions = analyser.toSeleniumCode(["call go to 'http://www.google.fr'"]);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
    });
});