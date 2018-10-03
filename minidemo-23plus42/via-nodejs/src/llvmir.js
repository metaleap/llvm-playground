"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(name, type, blocks = []) {
        this.name = name;
        this.type = type;
        this.blocks = blocks;
        this.srcIR = () => [`define ${this.type} @${this.name}() {`].concat(this.blocks.map(block => block.srcIR()), ["}"]).join("\n");
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
var next = -1;
class LlvmInstrAlloca {
    constructor(type) {
        this.type = type;
        this.srcIR = () => `%${this.name} = alloca ${this.type}`;
        this.name = ++next;
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
class LlvmInstrLoad {
    constructor(type, fromName) {
        this.type = type;
        this.fromName = fromName;
        this.srcIR = () => `%${this.name} = load ${this.type}, ${this.type}* %${this.fromName}`;
        this.name = ++next;
    }
}
exports.LlvmInstrLoad = LlvmInstrLoad;
class LlvmInstrAdd {
    constructor(type, nameL, nameR) {
        this.type = type;
        this.nameL = nameL;
        this.nameR = nameR;
        this.srcIR = () => `%${this.name} = add ${this.type} %${this.nameL}, %${this.nameR}`;
        this.name = ++next;
    }
}
exports.LlvmInstrAdd = LlvmInstrAdd;
class LlvmInstrRet {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.srcIR = () => `ret ${this.type} %${this.name}`;
    }
}
exports.LlvmInstrRet = LlvmInstrRet;
