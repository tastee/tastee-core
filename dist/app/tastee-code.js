"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TasteeCode {
    constructor(tasteeLine) {
        this.instructionWithParameters = tasteeLine;
        this.parameters = tasteeLine.match(/\$\w*/gi);
        this.codeLines = [];
        if (this.parameters) {
            this.regexMatcher = new RegExp("^" + tasteeLine.replace(new RegExp("\\" + this.parameters.join("|\\"), "g"), "(.*)"));
        }
        else {
            this.regexMatcher = new RegExp("^" + tasteeLine);
        }
    }
    addCodeLines(codeLines) {
        this.codeLines = this.codeLines.concat(codeLines);
    }
    toSeleniumCodeLines(matchingArray) {
        var seleniumCode = [];
        for (let line of this.codeLines) {
            seleniumCode.push(this._replaceTasteeParameters(line, matchingArray));
        }
        return seleniumCode;
    }
    _replaceTasteeParameters(codeLine, matcherArray) {
        if (this.parameters) {
            this.parameters.forEach(function (parameter, i) {
                codeLine = codeLine.split(parameter).join(matcherArray[i + 1]);
            });
        }
        return codeLine;
    }
}
exports.TasteeCode = TasteeCode;
class TasteeCodeMatcher {
    constructor(tasteeCode, matchingArray) {
        this.tasteeCode = tasteeCode;
        this.matchingArray = matchingArray;
    }
    toSeleniumCodeLines() {
        return this.tasteeCode.toSeleniumCodeLines(this.matchingArray);
    }
    static getSeleniumCodeFrom(tasteeLine, tasteeCodes) {
        let tasteeCodeMatcher = this._isTasteeCode(tasteeLine, tasteeCodes);
        if (tasteeCodeMatcher) {
            return tasteeCodeMatcher.toSeleniumCodeLines();
        }
        return [tasteeLine];
    }
    static _isTasteeCode(tasteeLine, tasteeCodes) {
        for (let tasteeCode of tasteeCodes) {
            var isMatching = tasteeLine.match(tasteeCode.regexMatcher);
            if (isMatching) {
                return new TasteeCodeMatcher(tasteeCode, isMatching);
            }
        }
        return;
    }
}
exports.TasteeCodeMatcher = TasteeCodeMatcher;

//# sourceMappingURL=tastee-code.js.map
