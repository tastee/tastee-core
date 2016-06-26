var util = require("util");

function Instruction(numberLine, tastyLine, command) {
  this.numberLine = numberLine;
  this.tastyLine = tastyLine;
  this.command = command;
}

Instruction.prototype.setValid = function (valid) {
  this.valid = valid;
};
Instruction.prototype.setErrorMessage = function (errorMessage) {
  this.errorMessage = errorMessage;
}
Instruction.prototype.toString = function () {
  return util.format('%s => %s : %s', this.numberLine, this.tastyLine === undefined ? "" : this.tastyLine, this.valid);
};

// export the class
module.exports = Instruction;