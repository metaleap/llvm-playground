/*
  why have our own, handcoded, vanishingly-tiny-subset-of LLVM-IR in here,
  instead of using one of "the numerous llvm packages on offer in NPM"?

  same reason as always in the Nodejs universe.. either they're bitrotted /
  outdated / stale / abandoned / erroring-out-for-other-reasons themselves --- or
  any of their dependencies. yes, tried them all and yes, wasted precious hours..
*/

export enum LlvmType {
	i32 = "i32"
}

interface LlvmSyn {
	srcIR(): string
}

export class LlvmModule implements LlvmSyn {
	constructor(
		readonly name: string,
		readonly funcs: LlvmFunc[] = [],
	) { }

	srcIR = () =>
		[`; ModuleID = '${this.name}'`,
		`source_filename = "${this.name}"`].concat(
			this.funcs.map(fn => fn.srcIR()),
		).join("\n")
}

export class LlvmFunc implements LlvmSyn {
	constructor(
		readonly name: string,
		readonly type: LlvmType,
		readonly blocks: LlvmBlock[] = [],
	) { }

	srcIR = () =>
		[`define ${this.type} @${this.name}() {`].concat(
			this.blocks.map(block => block.srcIR()),
			["}"],
		).join("\n")
}

export class LlvmBlock implements LlvmSyn {
	constructor(
		readonly name: string,
		readonly instrs: LlvmInstr[] = [],
	) { }

	srcIR = () =>
		[`${this.name}:`].concat(
			this.instrs.map(instr => "\t" + instr.srcIR()),
		).join("\n")
}

interface LlvmInstr extends LlvmSyn { }

var next: number = -1

export class LlvmInstrAlloca implements LlvmInstr {
	readonly name: number
	constructor(
		readonly type: LlvmType,
	) { this.name = ++next }

	srcIR = () =>
		`%${this.name} = alloca ${this.type}`
}

export class LlvmInstrStore implements LlvmInstr {
	constructor(
		readonly type: LlvmType,
		readonly val: any,
		readonly name: number,
	) { }

	srcIR = () =>
		`store ${this.type} ${this.val}, ${this.type}* %${this.name}`
}

export class LlvmInstrLoad implements LlvmInstr {
	readonly name: number
	constructor(
		readonly type: LlvmType,
		readonly fromName: number,
	) { this.name = ++next }

	srcIR = () =>
		`%${this.name} = load ${this.type}, ${this.type}* %${this.fromName}`
}

export class LlvmInstrAdd implements LlvmInstr {
	readonly name: number
	constructor(
		readonly type: LlvmType,
		readonly nameL: number,
		readonly nameR: number,
	) { this.name = ++next }

	srcIR = () =>
		`%${this.name} = add ${this.type} %${this.nameL}, %${this.nameR}`
}

export class LlvmInstrRet implements LlvmInstr {
	constructor(
		readonly type: LlvmType,
		readonly name: number,
	) { }

	srcIR = () =>
		`ret ${this.type} %${this.name}`
}
