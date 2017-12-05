import * as util from 'util';

export class TasteeCode {
    instructionWithParameters: string;
    parameters: string[];
    regexMatcher: RegExp;
    codeLines: string[];

    constructor(tasteeLine: string) {
        this.instructionWithParameters = tasteeLine;
        this.parameters = tasteeLine.match(/\$\w*/gi);
        this.codeLines = [];
        
        if (this.parameters) {
            this.regexMatcher = new RegExp("^" + tasteeLine.replace(new RegExp("\\" + this.parameters.join("|\\"), "g"), "(.*)"));
        } else {
            this.regexMatcher = new RegExp("^" + tasteeLine);
        }
    }

    addCodeLines(codeLines: string[]) {
        this.codeLines = this.codeLines.concat(codeLines);
    }

    toSeleniumCodeLines(matchingArray: string[]): string[] {
        var seleniumCode = [];
        for (let line of this.codeLines) {
            seleniumCode.push(this._replaceTasteeParameters(line, matchingArray));
        }
        return seleniumCode;
    }

    private _replaceTasteeParameters(codeLine: string, matcherArray: string[]): string {
        if (this.parameters) {
            this.parameters.forEach(function (parameter, i) {
                codeLine = codeLine.split(parameter).join(matcherArray[i + 1]);
            });
        }
        return codeLine;
    }

}

export class TasteeCodeMatcher{
    tasteeCode : TasteeCode;
    matchingArray : string[];

    private constructor(tasteeCode : TasteeCode, matchingArray: string[]){
        this.tasteeCode = tasteeCode;
        this.matchingArray = matchingArray;
    }

    private toSeleniumCodeLines() : string[] {
        return this.tasteeCode.toSeleniumCodeLines(this.matchingArray);
    }

    static getSeleniumCodeFrom(tasteeLine : string, tasteeCodes : TasteeCode[]) : string[] {
        let tasteeCodeMatcher = this._isTasteeCode(tasteeLine, tasteeCodes);
        if (tasteeCodeMatcher) {
            return tasteeCodeMatcher.toSeleniumCodeLines();
        }
        return [tasteeLine];
    }

    private static _isTasteeCode(tasteeLine , tasteeCodes : TasteeCode[]) : TasteeCodeMatcher {
        for (let tasteeCode of tasteeCodes) {
            var isMatching = tasteeLine.match(tasteeCode.regexMatcher)
            if (isMatching) {
                return new TasteeCodeMatcher(tasteeCode,isMatching)
            }
        }
        return;
    }

}