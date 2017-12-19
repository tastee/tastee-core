"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TasteeReporter {
    constructor() { }
    generateConsoleLog(instructions) {
        for (var i = 0; i < instructions.length; i++) {
            console.log(instructions[i].toString());
        }
    }
}
exports.TasteeReporter = TasteeReporter;

//# sourceMappingURL=tastee-reporter.js.map
