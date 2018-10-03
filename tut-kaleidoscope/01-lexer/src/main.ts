import * as llvmir from "../../../node-llvm-ir/src/llvmir"

import * as lex from './lex'

const src1 = `
def fib(x)
  if x < 3 then
    1
  else
    fib(x-1)+fib(x-2)

fib(40)
`

const src2 = `
extern sin(arg);
extern cos(arg);
extern atan2(arg1 arg2);

atan2(sin(.4), cos(42))
`

const srcs = [src1, src2, llvmir.Type.i32 /* last item is never used, just referenced so we dont have to ditch the import which would wreck the ./out/* dir structure (crikey, TS!) */]
const idx = (Math.random() * (srcs.length - 1)) | 0 // int
for (const tok of lex.tokens(srcs[idx])) console.log(tok.raw)
