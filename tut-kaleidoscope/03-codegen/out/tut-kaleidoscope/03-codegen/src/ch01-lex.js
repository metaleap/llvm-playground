"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type[Type["Ident"] = 0] = "Ident";
    Type[Type["Keyword"] = 1] = "Keyword";
    Type[Type["OpArith"] = 2] = "OpArith";
    Type[Type["OpCmp"] = 3] = "OpCmp";
    Type[Type["Sep"] = 4] = "Sep";
    Type[Type["NumLit"] = 5] = "NumLit";
})(Type = exports.Type || (exports.Type = {}));
function tokens(src) {
    const tokens = [];
    let cur = { raw: "", type: Type.Ident };
    const pushOldAndBeginNew = (beginWith) => {
        if (cur.raw) {
            if (!cur.type) {
                cur.type = Type.Ident;
                if (cur.raw === 'def' || cur.raw === 'extern' || cur.raw === 'if' || cur.raw === 'then' || cur.raw === 'else')
                    cur.type = Type.Keyword;
                else if (!isNaN(cur.lit = parseFloat(cur.raw)))
                    cur.type = Type.NumLit;
            }
            tokens.push(cur);
        }
        cur = { raw: beginWith, type: Type.Ident };
    };
    let is_oparith, is_opcmp, is_sep;
    for (const c of src)
        if (c === ' ' || c === '\t' || c === '\v' || c === '\b' || c === '\r' || c === '\n')
            pushOldAndBeginNew('');
        else if ((is_oparith = c === '+' || c === '-' || c === '*' || c === '/')
            || (is_opcmp = c === '<' || c === '>' || c === '=' || c === '!')
            || (is_sep = c === '(' || c === ')' || c === ',' || c === ';')) {
            pushOldAndBeginNew(c);
            cur.type = is_oparith ? Type.OpArith : (is_opcmp ? Type.OpCmp : Type.Sep);
            pushOldAndBeginNew('');
        }
        else
            cur.raw += c;
    pushOldAndBeginNew('');
    return tokens;
}
exports.tokens = tokens;
