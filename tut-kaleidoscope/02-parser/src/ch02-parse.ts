import * as lex from './ch01-lex'
import * as ast from './ch02-ast'

export function topLevelDecls(toks: lex.Token[]): ast.ISyn[] {
    const toplevel: ast.ISyn[] = []

    let lastStart: number = 0
    for (let i = 1; i < toks.length; i++) {
        if (toks[i].type === lex.Type.Keyword && (toks[i].raw === 'def' || toks[i].raw === 'extern')) {
            toplevel.push(parseTopLevelDecl(toks.slice(lastStart, i)))
            lastStart = i
        }
    }
    toplevel.push(parseTopLevelDecl(toks.slice(lastStart)))
    return toplevel
}

function parseTopLevelDecl(toks: lex.Token[]): ast.ISyn {
    if ((!toks) || (!toks.length) || toks[0].type !== lex.Type.Keyword)
        throw "parse error: top-level definition expected to begin with `def` or `extern` keyword"
    if (toks[0].raw === "def")
        return parseTopLevelDef(toks)
    if (toks[0].raw === "extern")
        return parseTopLevelExt(toks)

    throw "bug in lexer: unknown `" + toks[0].raw + "` was classified as keyword"
}

function parseTopLevelExt(toks: lex.Token[]): ast.FuncExt {
    return new ast.FuncExt(parseFuncType('extern', toks.slice(1)))
}

function parseTopLevelDef(toks: lex.Token[]): ast.FuncDef {
    const posclosingparen = toks.findIndex(tok => tok.type === lex.Type.Sep && tok.raw === ')')
    const sig = parseFuncType('def', toks.slice(1, posclosingparen + 1))
    return new ast.FuncDef(sig, parseExpr(sig.name, toks.slice(posclosingparen + 1)))
}

function parseFuncType(keyword: string, toks: lex.Token[]): ast.FuncType {
    const last = toks.length - 1
    if (toks.length < 3 || toks[0].type !== lex.Type.Ident
        || toks[1].type !== lex.Type.Sep || toks[1].raw !== "("
        || toks[last].type !== lex.Type.Sep || toks[last].raw !== ")")
        throw keyword + ": needs at least a name and parentheses"
    if (toks[0].type !== lex.Type.Ident)
        throw keyword + ": expected name"

    const name = toks[0].raw
    const args: string[] = []
    if (toks.length > 3)
        for (let i = 2; i < last; i++)
            if (toks[i].type === lex.Type.Ident)
                args.push(toks[i].raw)
            else if (!(toks[i].type === lex.Type.Sep && toks[i].raw === ','))
                throw keyword + ": `" + toks[i].raw + "` is not a valid arg"
    return new ast.FuncType(name, args)
}

function parseExpr(topLevelName: string, toks: lex.Token[]): ast.IExpr {
    if (toks.length === 1) {
        if (toks[0].type === lex.Type.NumLit)
            return parseExprNum(toks)
        else if (toks[0].type === lex.Type.Ident)
            return parseExprVar(toks)
    } else if (toks.length > 1) {
        let posop: number
        if (toks[0].type === lex.Type.Keyword && toks[0].raw === 'if')
            return parseExprIf(topLevelName, toks)
        else if (!isNaN(posop = findIndex(topLevelName, '', toks, false, t => t.type === lex.Type.OpArith || t.type === lex.Type.OpCmp)))
            return parseExprOp(topLevelName, posop, toks)
        else if (toks[0].type === lex.Type.Sep && toks[0].raw === '(')
            return parseExprParens(topLevelName, toks)
        else if (toks[0].type === lex.Type.Ident && toks[1].type === lex.Type.Sep && toks[1].raw === '(')
            return parseExprCall(topLevelName, toks)
    }
    throw errMsg(topLevelName, "def", toks)
}

function parseExprNum(toks: lex.Token[]): ast.IExpr {
    return new ast.Num(toks[0].lit)
}

function parseExprVar(toks: lex.Token[]): ast.IExpr {
    return new ast.Var(toks[0].raw)
}

function parseExprCall(topLevelName: string, toks: lex.Token[]): ast.IExpr {
    const parsekind = toks[0].raw + "(...)"
    const posclosingparen = findClosingParenIndex(topLevelName, parsekind, toks.slice(1)) + 1
    if (posclosingparen === (toks.length - 1)) {
        const poscommas = findIndices(toks.slice(2, posclosingparen), 0,
            t => t.type === lex.Type.Sep && t.raw === ',',
        ).map(i => i + 2)
        poscommas.push(posclosingparen)

        const args: ast.IExpr[] = []
        for (let i = 0, poslast = 2; i < poscommas.length; i++) {
            args.push(parseExpr(topLevelName, toks.slice(poslast, poscommas[i])))
            poslast = poscommas[i] + 1
        }
        return new ast.Call(parseExpr(topLevelName, toks.slice(0, 1)), args)
    }
    throw errMsg(topLevelName, parsekind, toks)
}

function parseExprParens(topLevelName: string, toks: lex.Token[]): ast.IExpr {
    const posclosingparen = findClosingParenIndex(topLevelName, "()", toks)
    if (posclosingparen === (toks.length - 1))
        return parseExpr(topLevelName, toks.slice(1, posclosingparen))
    throw errMsg(topLevelName, "()", toks)
}

function parseExprIf(topLevelName: string, toks: lex.Token[]): ast.IExpr {
    const posthen = findIndex(topLevelName, "if", toks, true, t => t.type === lex.Type.Keyword && t.raw === 'then')
    const poselse = findIndex(topLevelName, "if", toks, true, t => t.type === lex.Type.Keyword && t.raw === 'else')
    if (posthen > 1 && poselse > posthen) {
        return new ast.If(parseExpr(topLevelName, toks.slice(1, posthen)),
            parseExpr(topLevelName, toks.slice(posthen + 1, poselse)),
            parseExpr(topLevelName, toks.slice(poselse + 1)))
    }
    throw errMsg(topLevelName, "if", toks)
}

function parseExprOp(topLevelName: string, posNextOp: number, toks: lex.Token[]): ast.IExpr {
    return new ast.BinOp(toks[posNextOp].raw,
        parseExpr(topLevelName, toks.slice(0, posNextOp)),
        parseExpr(topLevelName, toks.slice(posNextOp + 1)),
    )
}

function errMsg(topLevelName: string, parseKind: string, toks: lex.Token[]): string {
    return topLevelName + ": `" + parseKind + "` parse error near: " + toks.map(t => t.raw).join(' ')
}

function findIndices(toks: lex.Token[], numMax: number, check: (_: lex.Token) => boolean): number[] {
    let skip: number = 0
    const ret: number[] = []
    for (let i = 0; i < toks.length && (numMax < 1 || ret.length < numMax); i++)
        if (toks[i].type === lex.Type.Sep && toks[i].raw === '(')
            skip++
        else if (toks[i].type === lex.Type.Sep && toks[i].raw === ')')
            skip--
        else if (skip === 0 && check(toks[i]))
            ret.push(i)
    return ret
}

function findIndex(topLevelName: string, parseKind: string, toks: lex.Token[], orFail: boolean, check: (_: lex.Token) => boolean): number {
    const indices = findIndices(toks, 1, check)
    if (indices.length === 1)
        return indices[0]
    if (orFail)
        throw errMsg(topLevelName, parseKind + "(?)", toks)
    return NaN
}

function findClosingParenIndex(topLevelName: string, parseKind: string, toks: lex.Token[]): number {
    let skip: number = 0
    for (let i = 1; i < toks.length; i++)
        if (toks[i].type === lex.Type.Sep)
            if (toks[i].raw === '(')
                skip++
            else if (toks[i].raw === ')' && (--skip) < 0)
                return i
    throw errMsg(topLevelName, parseKind + "()", toks)
}
