var Instruction = require('../../app/instruction');
       
describe("Tasty Instruction", function() {


    it(" print all field into this", function() {
        var instruction = new Instruction (1,"go to www.google.fr" ,"expect(true).toBe(true);");
        instruction.setValid(true);
        expect(instruction.toString()).toBe("go to www.google.fr => true");
    });
    

    it(" print empty field if field is undefined this", function() {
        var instruction = new Instruction ();
        instruction.setValid(true);
        expect(instruction.toString()).toBe(" => true");
    });
 
});