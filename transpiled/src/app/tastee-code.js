"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TasteeCode = /** @class */ (function () {
    function TasteeCode(tasteeLine) {
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
    TasteeCode.prototype.addCodeLines = function (codeLines) {
        this.codeLines = this.codeLines.concat(codeLines);
    };
    TasteeCode.prototype.toSeleniumCodeLines = function (matchingArray) {
        var seleniumCode = [];
        for (var _i = 0, _a = this.codeLines; _i < _a.length; _i++) {
            var line = _a[_i];
            seleniumCode.push(this._replaceTasteeParameters(line, matchingArray));
        }
        return seleniumCode;
    };
    TasteeCode.prototype._replaceTasteeParameters = function (codeLine, matcherArray) {
        if (this.parameters) {
            this.parameters.forEach(function (parameter, i) {
                codeLine = codeLine.split(parameter).join(matcherArray[i + 1]);
            });
        }
        return codeLine;
    };
    return TasteeCode;
}());
exports.TasteeCode = TasteeCode;
var TasteeCodeMatcher = /** @class */ (function () {
    function TasteeCodeMatcher(tasteeCode, matchingArray) {
        this.tasteeCode = tasteeCode;
        this.matchingArray = matchingArray;
    }
    TasteeCodeMatcher.prototype.toSeleniumCodeLines = function () {
        return this.tasteeCode.toSeleniumCodeLines(this.matchingArray);
    };
    TasteeCodeMatcher.getSeleniumCodeFrom = function (tasteeLine, tasteeCodes) {
        var tasteeCodeMatcher = this._isTasteeCode(tasteeLine, tasteeCodes);
        if (tasteeCodeMatcher) {
            return tasteeCodeMatcher.toSeleniumCodeLines();
        }
        return [tasteeLine];
    };
    TasteeCodeMatcher._isTasteeCode = function (tasteeLine, tasteeCodes) {
        for (var _i = 0, tasteeCodes_1 = tasteeCodes; _i < tasteeCodes_1.length; _i++) {
            var tasteeCode = tasteeCodes_1[_i];
            var isMatching = tasteeLine.match(tasteeCode.regexMatcher);
            if (isMatching) {
                return new TasteeCodeMatcher(tasteeCode, isMatching);
            }
        }
        return;
    };
    return TasteeCodeMatcher;
}());
exports.TasteeCodeMatcher = TasteeCodeMatcher;

//# sourceMappingURL=tastee-code.js.map
