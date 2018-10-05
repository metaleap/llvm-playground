"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Num {
    constructor(tok) {
        if ((this.val = parseFloat(tok.raw)) === undefined)
            throw (tok);
    }
}
exports.Num = Num;
class Var {
    constructor(tok) {
        this.name = tok.raw;
    }
}
exports.Var = Var;
