import * as ast from './ast'
import * as lex from './lex'

export function topLevelDecls(toks: lex.Token[]): ast.ISyn[] {
    const toplevel: ast.ISyn[] = []

    let lastStart: number = 0
    for (let i = 1; i < toks.length; i++) {
        if (toks[i].type === lex.Type.Keyword) {
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
    return new ast.FuncExt(
        parseFuncType('extern', toks.slice(1)),
    )
}

function parseTopLevelDef(toks: lex.Token[]): ast.FuncDef {
    const posclosingparen = toks.findIndex(tok => tok.type === lex.Type.Sep && tok.raw === ')')
    return new ast.FuncDef(
        parseFuncType('def', toks.slice(1, posclosingparen + 1)),
        parseExpr(toks.slice(posclosingparen + 1)),
    )
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

function parseExpr(_: lex.Token[]): ast.IExpr {
    return new ast.Num(123)
}
