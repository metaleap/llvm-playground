"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ast = __importStar(require("./ch02-ast"));
function genIR(syn) {
    switch (true) {
        case syn.constructor === ast.Num:
            break;
        case syn.constructor === ast.Var:
            break;
        case syn.constructor === ast.If:
            break;
        case syn.constructor === ast.BinOp:
            break;
        case syn.constructor === ast.Call:
            break;
        case syn.constructor === ast.FuncExt:
            break;
        case syn.constructor === ast.FuncDef:
            break;
    }
    throw "TODO";
}
exports.genIR = genIR;
