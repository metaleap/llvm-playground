import * as llvmir from "../../../node-llvm-ir/src/llvmir" // not used in 01-lexer but dropping this import would wreck the ./out/* dir structure (crikey, TS!)

import * as lex from './ch01-lex'

const src1 = `
def fib(x)
    if x < 3 then
        1
    else
        fib(x-1)+fib(x-2)

def main()
    fib(40)
`

const src2 = `
extern sin(arg)
extern cos(arg)
extern atan2(arg1 arg2)

def main()
    atan2(sin(.4), cos(42))
`

const srcs = [src1, src2, llvmir.Type.i32 /* last item is never used, just referenced so we dont have to ditch the import which would wreck the ./out/* dir structure (crikey, TS!) */]
const idx = (Math.random() * (srcs.length - 1)) | 0 // int
const toks = lex.tokens(srcs[idx])
for (const tok of toks)
    console.log(tok.type + "\t" + tok.raw)
