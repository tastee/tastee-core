"use strict";

exports.Builder = class Builder {

    constructor() {
        this.jasmineCallback = null;
    }

    forBrowser(callback) {
        this.jasmineCallback = callback;
        this.jasmineCallback('forBrowser');
        return this;
    }

    build() {
        return this;
    }

    quit() {
        this.jasmineCallback('quit');
        return this;
    }

};

exports.By = '';

exports.promise = {
    controlFlow() {
        return new Flow();
    }
}

class Flow {
    constructor() {
        this.jasmineCallback = null;
    }

    execute(callback) {
        this.jasmineCallback = callback;
        this.jasmineCallback('execute');
        return new Promise(this.jasmineCallback);
    }
}