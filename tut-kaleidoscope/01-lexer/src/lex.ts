export type Token = {
    raw: string
}

export function tokens(src: string): Token[] {
    const tokens: Token[] = []
    let curtok = { raw: "" } as Token
    const begin = (beginWith: string) => {
        if (curtok.raw) tokens.push(curtok)
        curtok = { raw: beginWith } as Token
    }
    for (const c of src)
        if (c === ' ' || c === '\t' || c === '\v' || c === '\b' || c === '\r' || c === '\n')
            begin('')
        else if (c === '(' || c === ')' || c === '<' || c === '>' || c === '+' || c === '-' || c === '*' || c === '/' || c === ',' || c === ';' || c === '=' || c === '!') {
            begin(c)
            begin('')
        } else
            curtok.raw += c

    if (curtok.raw) tokens.push(curtok)
    return tokens
}
