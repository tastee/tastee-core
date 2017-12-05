"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var Instruction = /** @class */ (function () {
    function Instruction(lineNumber, tasteeLine, command) {
        this.lineNumber = lineNumber;
        this.tasteeLine = tasteeLine;
        this.command = command;
    }
    ;
    Instruction.prototype.setValid = function (valid) {
        this.valid = valid;
    };
    Instruction.prototype.setErrorMessage = function (errorMessage) {
        this.errorMessage = errorMessage;
    };
    Instruction.prototype.toString = function () {
        return util.format('%s => %s : %s%s', this.lineNumber, this.tasteeLine === undefined ? "" : this.tasteeLine, this.valid, this.valid ? "" : "\n" + this.errorMessage);
    };
    return Instruction;
}());
exports.Instruction = Instruction;

//# sourceMappingURL=instruction.js.map
