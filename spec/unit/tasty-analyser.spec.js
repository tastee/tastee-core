var analyser = require('../../app/tasty-analyser.js');

describe("Tasty Analyser", function() {

    beforeAll(function(done) {
        analyser.addPluginFile('./plugin/common-instructions.conf.tty', done);
        analyser.addParamFile('./spec/examples/my-parameters.param.tty');
    });


    it("Add tasty code file as plugin - go to - verify paramters", function() {
        expect(analyser.getTastyCode()['go to $url'].parameters[0]).toBe('$url');
    });

    it("Add tasty code file as plugin - click on - verify codeLines", function() {
        expect(analyser.getTastyCode()['click on $name'].codeLines[0]).toBe('driver.findElement(By.name($name)).click();');
    });

    it("Translate tasty code to selenium code - go to", function() {
        var toSeleniumCode = analyser.toSeleniumCode(['go to http://www.google.fr']);
        expect(toSeleniumCode).toBe("driver.get('http://www.google.fr');");
    });

    it("Translate tasty code to selenium code - verify", function() {
        var toSeleniumCode = analyser.toSeleniumCode(['verify that myField is myValue']);
        expect(toSeleniumCode).toBe("var element = driver.findElement(By.css('.'+'myField'));\n"+
                                    "element.getText().then(function(text) {\n"+
                                    "assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text);\n"+
                                    "});");
    });
    
    it("Translate using parameters", function() {
        var toSeleniumCode = analyser.toSeleniumCode(['verify that param.field is param.value']);
        expect(toSeleniumCode).toBe("var element = driver.findElement(By.css('.'+'myField'));\n"+
                                    "element.getText().then(function(text) {\n"+
                                    "assert.equal(text, 'myValue', 'the '+ 'myField' + ' element contains '+text);\n"+
                                    "});");
    });
});