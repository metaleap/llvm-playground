"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var counter = 0;
var LlvmType;
(function (LlvmType) {
    LlvmType["i32"] = "i32";
})(LlvmType = exports.LlvmType || (exports.LlvmType = {}));
class LlvmModule {
    constructor(name, funcs = []) {
        this.name = name;
        this.funcs = funcs;
        this.srcIR = () => [`; ModuleID = '${this.name}'`,
            `source_filename = "${this.name}"`].concat(this.funcs.map(fn => fn.srcIR())).join("\n");
    }
}
exports.LlvmModule = LlvmModule;
class LlvmFunc {
    constructor(name, retType, blocks = []) {
        this.name = name;
        this.retType = retType;
        this.blocks = blocks;
        this.srcIR = () => [`define ${this.retType} @${this.name}() {`].concat(this.blocks.map(block => block.srcIR()), ["}"]).join("\n");
    }
}
exports.LlvmFunc = LlvmFunc;
class LlvmBlock {
    constructor(name, instrs = []) {
        this.name = name;
        this.instrs = instrs;
        this.srcIR = () => [`${this.name}:`].concat(this.instrs.map(instr => "\t" + instr.srcIR())).join("\n");
    }
}
exports.LlvmBlock = LlvmBlock;
class LlvmInstrAlloca {
    constructor(type) {
        this.type = type;
        this.srcIR = () => `%${this.name} = alloca ${this.type}`;
        this.name = counter;
        counter++;
    }
}
exports.LlvmInstrAlloca = LlvmInstrAlloca;
class LlvmInstrStore {
    constructor(type, val, name) {
        this.type = type;
        this.val = val;
        this.name = name;
        this.srcIR = () => `store ${this.type} ${this.val}, ${this.type}* %${this.name}`;
    }
}
exports.LlvmInstrStore = LlvmInstrStore;
