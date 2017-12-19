import { Instruction } from './instruction';
import * as fs from 'fs';
import * as path from 'path';
import * as mustache from 'mustache';

export class TasteeReporter {

    constructor() { }

    generateConsoleLog(instructions: Instruction[]): void {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString())
        }
    }
}

