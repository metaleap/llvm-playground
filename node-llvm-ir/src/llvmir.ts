
export enum Type {
    i32 = "i32"
}

interface ISyn {
    srcIR(): string
}

export class Module implements ISyn {
    constructor(
        readonly name: string,
        readonly funcs: Func[] = [],
    ) { }

    srcIR = () =>
        [`; ModuleID = '${this.name}'`,
        `source_filename = "${this.name}"`].concat(
            this.funcs.map(fn => fn.srcIR()),
        ).join("\n")
}

export class Func implements ISyn {
    constructor(
        readonly name: string,
        readonly type: Type,
        readonly blocks: Block[] = [],
    ) { }

    srcIR = () =>
        [`define ${this.type} @${this.name}() {`].concat(
            this.blocks.map(block => block.srcIR()),
            ["}"],
        ).join("\n")
}

export class Block implements ISyn {
    constructor(
        readonly name: string,
        readonly instrs: IInstr[] = [],
    ) { }

    srcIR = () =>
        [`${this.name}:`].concat(
            this.instrs.map(instr => "\t" + instr.srcIR()),
        ).join("\n")
}

interface IInstr extends ISyn { }

var next: number = -1

export class InstrAlloca implements IInstr {
    readonly name: number
    constructor(
        readonly type: Type,
    ) { this.name = ++next }

    srcIR = () =>
        `%${this.name} = alloca ${this.type}`
}

export class InstrStore implements IInstr {
    constructor(
        readonly type: Type,
        readonly val: any,
        readonly name: number,
    ) { }

    srcIR = () =>
        `store ${this.type} ${this.val}, ${this.type}* %${this.name}`
}

export class InstrLoad implements IInstr {
    readonly name: number
    constructor(
        readonly type: Type,
        readonly fromName: number,
    ) { this.name = ++next }

    srcIR = () =>
        `%${this.name} = load ${this.type}, ${this.type}* %${this.fromName}`
}

export class InstrAdd implements IInstr {
    readonly name: number
    constructor(
        readonly type: Type,
        readonly nameL: number,
        readonly nameR: number,
    ) { this.name = ++next }

    srcIR = () =>
        `%${this.name} = add ${this.type} %${this.nameL}, %${this.nameR}`
}

export class InstrRet implements IInstr {
    constructor(
        readonly type: Type,
        readonly name: number,
    ) { }

    srcIR = () =>
        `ret ${this.type} %${this.name}`
}
