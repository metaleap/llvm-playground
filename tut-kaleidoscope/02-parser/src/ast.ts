export interface ISyn {
    src(): string
}

export class FuncType {
    constructor(
        readonly name: string,
        readonly args: string[],
    ) { }
    src = () =>
        this.name + "(" + this.args.join(" ") + ")"
}

export class FuncDef {
    constructor(
        readonly sig: FuncType,
        readonly body: IExpr,
    ) { }
    src = () =>
        "def " + this.sig.src() + "\n  " + this.body.src()
}

export class FuncExt {
    constructor(
        readonly sig: FuncType,
    ) { }
    src = () =>
        "extern " + this.sig.src()
}

export interface IExpr extends ISyn {
}

export class Num implements IExpr {
    constructor(
        readonly val: number,
    ) { }
    src = () =>
        this.val.toString()
}

export class Var implements IExpr {
    constructor(
        readonly name: string,
    ) { }
    src = () =>
        this.name
}

export class BinOp implements IExpr {
    constructor(
        readonly op: string,
        readonly lhs: IExpr,
        readonly rhs: IExpr,
    ) { }
    src = () =>
        `(${this.lhs.src()} ${this.op} ${this.rhs.src()})`
}

export class Call implements IExpr {
    constructor(
        readonly callee: IExpr,
        readonly args: IExpr[],
    ) { }
    src = () =>
        this.callee.src() + "( " + this.args.map(arg => arg.src()).join(", ") + " )"
}

export class If implements IExpr {
    constructor(
        readonly cond: IExpr,
        readonly then: IExpr,
        readonly otherwise: IExpr,
    ) { }
    src = () =>
        "if " + this.cond.src() + " then " + this.then.src() + " else " + this.otherwise.src()
}
