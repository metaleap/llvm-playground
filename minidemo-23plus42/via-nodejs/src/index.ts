import { LlvmModule, LlvmFunc, LlvmBlock, LlvmType, LlvmInstrAlloca, LlvmInstrStore } from "./llvmir"

/*
define i32 @main() {
entry:
	%0 = alloca i32
	store i32 42, i32* %0
	%1 = alloca i32
	store i32 23, i32* %1
	%2 = load i32, i32* %0
	%3 = load i32, i32* %1
	%4 = add i32 %2, %3
	ret i32 %4
}
*/

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

console.log(mod.srcIR())
