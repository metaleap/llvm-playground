package main

import (
	"github.com/llir/llvm/ir"
	"github.com/llir/llvm/ir/constant"
	"github.com/llir/llvm/ir/types"
)

func main() {
	mod := ir.NewModule()
	main := mod.NewFunction("main", types.I32)
	block := main.NewBlock("entry")

	// int32 a = 42
	a_ptr := block.NewAlloca(types.I32)
	block.NewStore(constant.NewInt(42, types.I32), a_ptr)

	// int32 b = 23
	b_ptr := block.NewAlloca(types.I32)
	block.NewStore(constant.NewInt(23, types.I32), b_ptr)

	// return a+b
	a_val := block.NewLoad(a_ptr)
	b_val := block.NewLoad(b_ptr)
	result := block.NewAdd(a_val, b_val)
	block.NewRet(result)
	println(mod.String())
}
