import * as llvmir from "../../../node-llvm-ir/src/llvmir"

const mod = new llvmir.Module("oh_my_mod")

const main = new llvmir.Func("main", llvmir.Type.i32)
mod.funcs.push(main)

const entry = new llvmir.Block("entry")
main.blocks.push(entry)

// int32 a = 42
const a_ptr = new llvmir.InstrAlloca(llvmir.Type.i32)
entry.instrs.push(
    a_ptr,
    new llvmir.InstrStore(llvmir.Type.i32, 42, a_ptr.name),
)

// int32 b = 23
const b_ptr = new llvmir.InstrAlloca(llvmir.Type.i32)
entry.instrs.push(
    b_ptr,
    new llvmir.InstrStore(llvmir.Type.i32, 23, b_ptr.name),
)

// return a+b
const a_val = new llvmir.InstrLoad(llvmir.Type.i32, a_ptr.name)
const b_val = new llvmir.InstrLoad(llvmir.Type.i32, b_ptr.name)
const result = new llvmir.InstrAdd(llvmir.Type.i32, a_val.name, b_val.name)
entry.instrs.push(
    a_val, b_val, result, new llvmir.InstrRet(llvmir.Type.i32, result.name),
)

console.log(mod.srcIR())
