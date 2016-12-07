import * as util from 'util';

export class Instruction {
    lineNumber: number;
    tasteeLine: string;
    command: string;

    valid: boolean;
    errorMessage : string;

    constructor(lineNumber: number, tasteeLine: string, command: string){
        this.lineNumber = lineNumber;
        this.tasteeLine = tasteeLine;
        this.command = command;
    };

    setValid(valid) : void {
        this.valid = valid;
    }

    setErrorMessage(errorMessage):void {
        this.errorMessage = errorMessage;
    }

    toString(): string {
        return util.format('%s => %s : %s%s', this.lineNumber, this.tasteeLine === undefined ? "" : this.tasteeLine, this.valid, this.valid?"":"\n"+this.errorMessage);
    }
}
