var analyser = require('../../app/tastee-analyser');

describe("Tastee Analyser", function() {

    beforeAll(function(done) {
        analyser.addPluginFile('./plugin/common-instructions.conf.tee', function(){
            analyser.addPluginFile('./spec/examples/test-instructions.conf.tee', done);
        });
        //analyser.addPluginFile('./spec/examples/test-instructions.conf.tee', done);
        analyser.addParamFile('./spec/examples/my-parameters.param.tee');
    });


    it("Add tastee code file as plugin - go to - verify paramters", function() {
        expect(analyser.getTasteeCode()['go to $url'].parameters[0]).toBe('$url');
    });

    it("Add tastee code file as plugin - click on - verify codeLines", function() {
        expect(analyser.getTasteeCode()['click on $name'].codeLines[0]).toBe('driver.findElement(By.name($name)).click();');
    });

    it("Translate tastee code to selenium code - go to", function() {
        var instructions = analyser.toSeleniumCode(['go to http://www.google.fr']);
        expect(instructions.length).toBe(1);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
        expect(instructions[0].tasteeLine).toBe("go to http://www.google.fr");
    });

    it("Translate tastee code to selenium code - verify", function() {
        var instructions = analyser.toSeleniumCode(['verify that myField is myValue']);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('.'+'myField'));\n"+
                                    "element.getText().then(function(text) {\n"+
                                    "assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text);\n"+
                                    "});");
    });
    
    it("Translate using parameters", function() {
        var instructions = analyser.toSeleniumCode(['verify that param.field is param.value']);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('.'+'myField'));\n"+
                                    "element.getText().then(function(text) {\n"+
                                    "assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text);\n"+
                                    "});");
    });
    
    it("manage multiple occurences of function parameters when translating", function() {
        var instructions = analyser.toSeleniumCode(['log some thisValue twice']);
        expect(instructions[0].command).toBe("console.log('log once '+'thisValue'+', and twice '+'thisValue');");
    });
    
    it("manage multiple occurences of external parameters when translating", function() {
        var instructions = analyser.toSeleniumCode(['verify that param.field is param.field']);
        expect(instructions[0].command).toBe("var element = driver.findElement(By.css('.'+'myField'));\n"+
                                    "element.getText().then(function(text) {\n"+
                                    "assert.equal(text, 'myField', 'the '+ 'myField' + ' element contains '+text);\n"+
                                    "});");
    });

    it("manages intructions that call other instruction", function() {
        //see ./spec/examples/test-instructions.conf.tee
        var instructions = analyser.toSeleniumCode(['call go to google']);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
    });

    it("manages intructions that call other instruction and parameters", function() {
        //see ./spec/examples/test-instructions.conf.tee
        var instructions = analyser.toSeleniumCode(['call go to http://www.google.fr']);
        expect(instructions[0].command).toBe("driver.get('http://www.google.fr');");
    });
    
});