/* tslint:disable:no-unused-variable */

////////  SPECS  /////////////
import {Instruction} from "../../app/instruction";
describe('Tastee Instruction', function () {

    let instruction : Instruction;

    beforeEach(() => {
        instruction = new Instruction(2, "a tastee line", "a command");
    });

    it('is created with lineNumber, tassteLine & command', () => {
        expect(instruction.lineNumber).toEqual(2);
        expect(instruction.tasteeLine).toEqual("a tastee line");
        expect(instruction.command).toEqual("a command")
    });

    it('display a readable toString', () => {
        instruction.setValid(true);
        instruction.setErrorMessage('no error')
        expect(instruction.toString()).toEqual('2 => a tastee line : true');
    });
});