import { Instruction } from './instruction';

export class TasteeReporter {

    constructor() { }

    generateConsoleLog(instructions: Instruction[]): void {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    }
}

