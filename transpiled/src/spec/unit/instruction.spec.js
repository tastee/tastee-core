"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
////////  SPECS  /////////////
var instruction_1 = require("../../app/instruction");
describe('Tastee Instruction', function () {
    var instruction;
    beforeEach(function () {
        instruction = new instruction_1.Instruction(2, "a tastee line", "a command");
    });
    it('is created with lineNumber, tassteLine & command', function () {
        expect(instruction.lineNumber).toEqual(2);
        expect(instruction.tasteeLine).toEqual("a tastee line");
        expect(instruction.command).toEqual("a command");
    });
    it('display a readable toString', function () {
        instruction.setValid(true);
        instruction.setErrorMessage('no error');
        expect(instruction.toString()).toEqual('2 => a tastee line : true');
    });
});

//# sourceMappingURL=instruction.spec.js.map
