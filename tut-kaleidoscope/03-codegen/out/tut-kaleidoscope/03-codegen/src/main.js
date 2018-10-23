"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const llvmir = __importStar(require("../../../node-llvm-ir/src/llvmir"));
const lex = __importStar(require("./ch01-lex"));
const ast = __importStar(require("./ch02-ast"));
const parse = __importStar(require("./ch02-parse"));
const src1 = `
def main()
    fib(40)

def fib(x)
    if x < 3 then
        1
    else
        fib(x-1)+fib(x-2)
`;
const src2 = `
extern sin(arg)
extern cos(arg)
extern atan2(arg1,arg2)

def main()
    atan2(sin(.4), cos(42))
`;
const srcs = [src1, src2, llvmir.Type.i32];
const idx = (Math.random() * (srcs.length - 1)) | 0;
const toks = lex.tokens(srcs[idx]);
const tlds = parse.topLevelDecls(toks);
for (const tld of tlds) {
    console.log(tld.src());
    console.log(tld.constructor === ast.FuncDef);
}
