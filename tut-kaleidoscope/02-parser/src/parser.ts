// import * as lex from './lex'

export interface ISyn {
}

export class Func {

}

export interface IExpr extends ISyn {
}

export class Num implements IExpr {
    constructor(readonly val: number) { }
}

export class Var implements IExpr {
    constructor(readonly name: string) { }
}

export class KeywordDef implements IExpr { }
export class KeywordExtern implements IExpr { }

export class BinOp implements IExpr {
    constructor(readonly op: string, readonly lhs: IExpr, readonly rhs: IExpr) { }
}

export class Call implements IExpr {
    constructor(readonly callee: IExpr, readonly args: IExpr[]) { }
}
