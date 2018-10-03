"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const llvmir_1 = require("./llvmir");
const mod = new llvmir_1.LlvmModule("oh_my_mod");
const main = new llvmir_1.LlvmFunc("main", llvmir_1.LlvmType.i32);
mod.funcs.push(main);
const entry = new llvmir_1.LlvmBlock("entry");
main.blocks.push(entry);
const a_ptr = new llvmir_1.LlvmInstrAlloca(llvmir_1.LlvmType.i32);
entry.instrs.push(a_ptr, new llvmir_1.LlvmInstrStore(llvmir_1.LlvmType.i32, 42, a_ptr.name));
const b_ptr = new llvmir_1.LlvmInstrAlloca(llvmir_1.LlvmType.i32);
entry.instrs.push(b_ptr, new llvmir_1.LlvmInstrStore(llvmir_1.LlvmType.i32, 23, b_ptr.name));
const a_val = new llvmir_1.LlvmInstrLoad(llvmir_1.LlvmType.i32, a_ptr.name);
const b_val = new llvmir_1.LlvmInstrLoad(llvmir_1.LlvmType.i32, b_ptr.name);
const result = new llvmir_1.LlvmInstrAdd(llvmir_1.LlvmType.i32, a_val.name, b_val.name);
entry.instrs.push(a_val, b_val, result, new llvmir_1.LlvmInstrRet(llvmir_1.LlvmType.i32, result.name));
console.log(mod.srcIR());