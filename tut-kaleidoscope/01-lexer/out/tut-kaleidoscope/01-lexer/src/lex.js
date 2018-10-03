"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tokens(src) {
    const tokens = [];
    let curtok = { raw: "" };
    const begin = (beginWith) => {
        if (curtok.raw)
            tokens.push(curtok);
        curtok = { raw: beginWith };
    };
    for (const c of src)
        if (c === ' ' || c === '\t' || c === '\v' || c === '\b' || c === '\r' || c === '\n')
            begin('');
        else if (c === '(' || c === ')' || c === '<' || c === '>' || c === '+' || c === '-' || c === '*' || c === '/' || c === ',' || c === ';' || c === '=' || c === '!') {
            begin(c);
            begin('');
        }
        else
            curtok.raw += c;
    if (curtok.raw)
        tokens.push(curtok);
    return tokens;
}
exports.tokens = tokens;
