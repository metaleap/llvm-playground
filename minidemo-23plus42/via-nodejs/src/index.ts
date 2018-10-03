import { LlvmModule, LlvmFunc, LlvmBlock, LlvmType, LlvmInstrAlloca, LlvmInstrStore, LlvmInstrLoad, LlvmInstrAdd, LlvmInstrRet } from "./llvmir"

const mod = new LlvmModule("oh_my_mod")

const main = new LlvmFunc("main", LlvmType.i32)
mod.funcs.push(main)

const entry = new LlvmBlock("entry")
main.blocks.push(entry)

// int32 a = 42
const a_ptr = new LlvmInstrAlloca(LlvmType.i32)
entry.instrs.push(
    a_ptr,
    new LlvmInstrStore(LlvmType.i32, 42, a_ptr.name),
)

// int32 b = 23
const b_ptr = new LlvmInstrAlloca(LlvmType.i32)
entry.instrs.push(
    b_ptr,
    new LlvmInstrStore(LlvmType.i32, 23, b_ptr.name),
)

// return a+b
const a_val = new LlvmInstrLoad(LlvmType.i32, a_ptr.name)
const b_val = new LlvmInstrLoad(LlvmType.i32, b_ptr.name)
const result = new LlvmInstrAdd(LlvmType.i32, a_val.name, b_val.name)
entry.instrs.push(
    a_val, b_val, result, new LlvmInstrRet(LlvmType.i32, result.name),
)

console.log(mod.srcIR())
