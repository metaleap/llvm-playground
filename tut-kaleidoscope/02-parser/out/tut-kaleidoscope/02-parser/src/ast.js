"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuncType {
    constructor(name, args) {
        this.name = name;
        this.args = args;
        this.src = () => this.name + "(" + this.args.join(" ") + ")";
    }
}
exports.FuncType = FuncType;
class FuncDef {
    constructor(sig, body) {
        this.sig = sig;
        this.body = body;
        this.src = () => "def " + this.sig.src() + "\n  " + this.body.src();
    }
}
exports.FuncDef = FuncDef;
class FuncExt {
    constructor(sig) {
        this.sig = sig;
        this.src = () => "extern " + this.sig.src();
    }
}
exports.FuncExt = FuncExt;
class Num {
    constructor(val) {
        this.val = val;
        this.src = () => this.val.toString();
    }
}
exports.Num = Num;
class Var {
    constructor(name) {
        this.name = name;
        this.src = () => this.name;
    }
}
exports.Var = Var;
class BinOp {
    constructor(op, lhs, rhs) {
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
        this.src = () => `(${this.lhs.src()} ${this.op} ${this.rhs.src()})`;
    }
}
exports.BinOp = BinOp;
class Call {
    constructor(callee, args) {
        this.callee = callee;
        this.args = args;
        this.src = () => this.callee.src() + "( " + this.args.map(arg => arg.src()).join(", ") + " )";
    }
}
exports.Call = Call;
class If {
    constructor(cond, then, otherwise) {
        this.cond = cond;
        this.then = then;
        this.otherwise = otherwise;
        this.src = () => "if " + this.cond.src() + " then " + this.then.src() + " else " + this.otherwise.src();
    }
}
exports.If = If;
