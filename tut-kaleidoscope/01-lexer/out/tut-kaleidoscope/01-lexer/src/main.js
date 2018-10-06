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
const lex = __importStar(require("./lex"));
const src1 = `
def fib(x)
  if x < 3 then
    1
  else
    fib(x-1)+fib(x-2)

def main()
  fib(40)
`;
const src2 = `
extern sin(arg)
extern cos(arg)
extern atan2(arg1 arg2)

def main()
  atan2(sin(.4), cos(42))
`;
const srcs = [src1, src2, llvmir.Type.i32];
const idx = (Math.random() * (srcs.length - 1)) | 0;
for (const tok of lex.tokens(srcs[idx]))
    console.log(tok.type + "\t" + tok.raw);
