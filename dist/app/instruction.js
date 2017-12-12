"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
class Instruction {
    constructor(lineNumber, tasteeLine, command) {
        this.lineNumber = lineNumber;
        this.tasteeLine = tasteeLine;
        this.command = command;
    }
    ;
    setValid(valid) {
        this.valid = valid;
    }
    setErrorMessage(errorMessage) {
        this.errorMessage = errorMessage;
    }
    toString() {
        return util.format('%s => %s : %s%s', this.lineNumber, this.tasteeLine === undefined ? "" : this.tasteeLine, this.valid, this.valid ? "" : "\n" + this.errorMessage);
    }
}
exports.Instruction = Instruction;

//# sourceMappingURL=instruction.js.map
