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
const tmp = llvmir.Type.i32;
const src1 = `
def fib(x)
  if x < 3 then
    1
  else
    fib(x-1)+fib(x-2)

fib(40)
`;
const src2 = `
extern sin(arg);
extern cos(arg);
extern atan2(arg1 arg2);

atan2(sin(.4), cos(42))
`;
const src = (tmp !== llvmir.Type.i32) ? src1 : src2;
for (const tok of lex.tokens(src))
    console.log(tok.raw);
