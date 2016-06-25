var util = require("util");

function Instruction(line, tastyLine, command) {
  this.line = line;
  this.tastyLine = tastyLine;
  this.command = command;
}

Instruction.prototype.setValid = function (result) {
  this.result = result;
};

Instruction.prototype.toString = function () {
  return util.format('%s => %s', this.tastyLine === undefined ? "" : this.tastyLine, this.result);
};

// export the class
module.exports = Instruction;