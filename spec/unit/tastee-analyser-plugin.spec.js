var analyser = require('../../app/tastee-analyser');

describe("Tastee Analyser Plugin", function() {

    beforeAll(function(done) {
      analyser.clear();
      analyser.addPluginFile('./plugin/common-instructions.conf.tee', function(){
        analyser.addPluginFile("./spec/examples/authentication/authentication-FCT.conf.tee", done);
      });
    });

    it("load and prepare tastee functions", function() {
      var tasteeCode = analyser.getTasteeCode()['connect using $login and $password as credentials'];
      expect(tasteeCode.codeLines[0]).toBe("driver.findElement(By.css('#login')).clear();");
      expect(tasteeCode.codeLines[1]).toBe("driver.findElement(By.css('#password')).clear();");
      expect(tasteeCode.codeLines[2]).toBe("driver.findElement(By.css('#login')).sendKeys($login);");
      expect(tasteeCode.codeLines[3]).toBe("driver.findElement(By.css('#password')).sendKeys($password);");
      expect(tasteeCode.codeLines[4]).toBe("driver.findElement(By.css('#Go')).click();");
    });

});
