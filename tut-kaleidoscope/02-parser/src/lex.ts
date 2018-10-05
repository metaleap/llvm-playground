export enum Type {
    Ident,
    Keyword,
    OpArith,
    OpCmp,
    Sep,
    NumLit
}

export type Token = {
    raw: string
    type: Type
    lit: number
}

export function tokens(src: string): Token[] {
    const tokens: Token[] = []
    let cur = { raw: "", type: Type.Ident } as Token

    const pushOldAndBeginNew = (beginWith: string) => {
        if (cur.raw) {
            if (!cur.type) {
                cur.type = Type.Ident
                if (cur.raw === 'def' || cur.raw === 'extern')
                    cur.type = Type.Keyword
                else if (!isNaN(cur.lit = parseFloat(cur.raw)))
                    cur.type = Type.NumLit
            }
            tokens.push(cur)
        }

        cur = { raw: beginWith, type: Type.Ident } as Token
    }

    let is_oparith, is_opcmp, is_sep: boolean
    for (const c of src)
        if (c === ' ' || c === '\t' || c === '\v' || c === '\b' || c === '\r' || c === '\n')
            pushOldAndBeginNew('')
        else if ((is_oparith = c === '+' || c === '-' || c === '*' || c === '/')
            || (is_opcmp = c === '<' || c === '>' || c === '=' || c === '!')
            || (is_sep = c === '(' || c === ')' || c === ',' || c === ';')) {
            pushOldAndBeginNew(c)
            cur.type = is_oparith ? Type.OpArith : (is_opcmp ? Type.OpCmp : Type.Sep)
            pushOldAndBeginNew('')
        } else
            cur.raw += c

    pushOldAndBeginNew('')
    return tokens
}
