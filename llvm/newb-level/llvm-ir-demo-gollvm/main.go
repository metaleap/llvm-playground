package main

// based on http://felixangell.com/blog/an-introduction-to-llvm-in-go/
//
// using the gollvm bindings costs much time, even on my 32GB-RAM top-of-the-line workstation:
//
// - `go get`-ing them (or following above-linked blogger's setup instructions),
//   the `./build.sh` step took somewhere between 30-50 mins (didn't properly time)
//
// - every `go install` of your llvm-importing package (such as this one) --- even if `main()` only
//   consists of `println(llvm.Version)` --- routinely took over 1m40s, negating Go's famous compile times

import (
	"llvm.org/llvm/bindings/go/llvm"
)

func main() {
	println("Last tested with LLVM 6.0.1,\n\tcurrent LLVM Go-bindings' version: " + llvm.Version + "\n~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=\n")

	builder := llvm.NewBuilder()
	defer builder.Dispose()
	mod := llvm.NewModule("oh_my_mod")
	// defer mod.Dispose() --- don't! will panic with "fatal error: unexpected signal during runtime execution"

	main_funcsig := llvm.FunctionType(llvm.Int32Type(), []llvm.Type{}, false)
	llvm.AddFunction(mod, "main", main_funcsig)
	main_block := llvm.AddBasicBlock(mod.NamedFunction("main"), "entry") // "entry": llvm-standard func-entry block name
	builder.SetInsertPoint(main_block, main_block.FirstInstruction())

	// int32 a = 42
	a_ptr := builder.CreateAlloca(llvm.Int32Type(), "a_ptr")
	builder.CreateStore(llvm.ConstInt(llvm.Int32Type(), 42, false), a_ptr)

	// int32 b = 23
	b_ptr := builder.CreateAlloca(llvm.Int32Type(), "b_ptr")
	builder.CreateStore(llvm.ConstInt(llvm.Int32Type(), 23, false), b_ptr)

	// return a+b
	a_val := builder.CreateLoad(a_ptr, "a_val")
	b_val := builder.CreateLoad(b_ptr, "b_val")
	result := builder.CreateAdd(a_val, b_val, "ab_val")
	builder.CreateRet(result)

	// verify
	if err := llvm.VerifyModule(mod, llvm.ReturnStatusAction); err != nil {
		panic(err)
	}

	mod.Dump()
	execer, err := llvm.NewExecutionEngine(mod)
	if err != nil {
		panic(err)
	}
	defer execer.Dispose()

	ret := execer.RunFunction(mod.NamedFunction("main"), []llvm.GenericValue{})
	println(ret.Int(false))

}
