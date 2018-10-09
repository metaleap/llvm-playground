import * as llvmir from "../../../node-llvm-ir/src/llvmir" // not used in 02-parser but dropping this import would wreck the ./out/* dir structure (crikey, TS!)

import * as lex from './ch01-lex'
import * as parse from './ch02-parse'

const src1 = `
def main()
    fib(40)

def fib(x)
    if x < 3 then
        1
    else
        fib(x-1)+fib(x-2)
`

const src2 = `
extern sin(arg)
extern cos(arg)
extern atan2(arg1,arg2)

def main()
    atan2(sin(.4), cos(42))
`

const srcs = [src1, src2, llvmir.Type.i32 /* last item is never used, just referenced so we dont have to ditch the import which would wreck the ./out/* dir structure (crikey, TS!) */]
const idx = (Math.random() * (srcs.length - 1)) | 0 // int
const toks = lex.tokens(srcs[idx])
const tlds = parse.topLevelDecls(toks)
for (const tld of tlds)
    console.log(tld.src())
