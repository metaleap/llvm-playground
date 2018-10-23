import * as ast from './ch02-ast'
import * as llvmir from '../../../node-llvm-ir/src/llvmir'

export function genIR(syn: ast.ISyn): llvmir.ISyn {
    switch (true) {
        case syn.constructor === ast.Num:
            return genExprNumIR(syn as ast.Num)
        case syn.constructor === ast.Var:
            break
        case syn.constructor === ast.If:
            break
        case syn.constructor === ast.BinOp:
            break
        case syn.constructor === ast.Call:
            break

        case syn.constructor === ast.FuncExt:
            break
        case syn.constructor === ast.FuncDef:
            break
    }
    throw "TODO"
}

function genExprNumIR(expr: ast.Num): llvmir.ISyn {
    return new llvmir.ConstantFP(expr.val)
}
