var util = require("util");

function Instruction(lineNumber, tasteeLine, command) {
  this.lineNumber = lineNumber;
  this.tasteeLine = tasteeLine;
  this.command = command;
}

Instruction.prototype.setValid = function (valid) {
  this.valid = valid;
};
Instruction.prototype.setErrorMessage = function (errorMessage) {
  this.errorMessage = errorMessage;
}
Instruction.prototype.toString = function () {
  return util.format('%s => %s : %s%s', this.lineNumber, this.tasteeLine === undefined ? "" : this.tasteeLine, this.valid, this.valid?"":"\n"+this.errorMessage);
};

// export the class
module.exports = Instruction;
