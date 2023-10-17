/* Hand-written tokenizer for XML tag matching. */

import { ExternalTokenizer, ContextTracker, InputStream } from "@lezer/lr";
import {
    StartTag,
    StartCloseTag,
    mismatchedStartCloseTag,
    incompleteStartCloseTag,
    MissingCloseTag,
    Element,
    OpenTag,
    commentContent as _commentContent,
    piContent as _piContent,
    cdataContent as _cdataContent,
} from "./generated-assets/lezer-doenet.terms";

function nameChar(ch: number) {
    return (
        ch == 45 ||
        ch == 46 ||
        ch == 58 ||
        (ch >= 65 && ch <= 90) ||
        ch == 95 ||
        (ch >= 97 && ch <= 122) ||
        ch >= 161
    );
}

function isSpace(ch: number) {
    return ch == 9 || ch == 10 || ch == 13 || ch == 32;
}

let cachedName: string | null = null,
    cachedInput: InputStream | null = null,
    cachedPos = 0;
function tagNameAfter(input: InputStream, offset: number) {
    let pos = input.pos + offset;
    if (cachedInput == input && cachedPos == pos) return cachedName;
    while (isSpace(input.peek(offset))) offset++;
    let name = "";
    for (;;) {
        let next = input.peek(offset);
        if (!nameChar(next)) break;
        name += String.fromCharCode(next);
        offset++;
    }
    cachedInput = input;
    cachedPos = pos;
    return (cachedName = name || null);
}

class ElementContext {
    name: string;
    parent: ElementContext | null;
    hash: number;
    constructor(name: string, parent: ElementContext | undefined | null) {
        this.name = name;
        this.parent = parent ?? null;
        this.hash = parent ? parent.hash : 0;
        for (let i = 0; i < name.length; i++) {
            this.hash +=
                (this.hash << 4) +
                name.charCodeAt(i) +
                (name.charCodeAt(i) << 8);
        }
    }
}

export const elementContext = new ContextTracker<ElementContext | null>({
    start: null,
    shift(context, term, stack, input) {
        return term == StartTag
            ? new ElementContext(tagNameAfter(input, 1) || "", context)
            : context;
    },
    reduce(context, term) {
        return term == Element && context ? context.parent : context;
    },
    reuse(context, node, _stack, input) {
        let type = node.type.id;
        return type == StartTag || type == OpenTag
            ? new ElementContext(tagNameAfter(input, 1) || "", context)
            : context;
    },
    hash(context) {
        return context ? context.hash : 0;
    },
    strict: false,
});

export const startTag = new ExternalTokenizer(
    (input, stack) => {
        if (input.next !== 60 /* '<' */) {
            return;
        }
        const nextNext = input.peek(1);
        if (nextNext === 61 /* '=' */ || nextNext === 60 /* '<' */) {
            return;
        }
        input.advance();
        // @ts-ignore
        if (input.next === 47 /* '/' */) {
            input.advance();
            let name = tagNameAfter(input, 0);
            if (!name) {
                return input.acceptToken(incompleteStartCloseTag);
            }
            if (
                stack.context &&
                name.toLowerCase() == stack.context.name.toLowerCase()
            ) {
                return input.acceptToken(StartCloseTag);
            }
            for (let cx = stack.context; cx; cx = cx.parent) {
                if (cx.name === name) {
                    return input.acceptToken(MissingCloseTag, -2);
                }
            }
            input.acceptToken(mismatchedStartCloseTag);
        } else if (
            // @ts-ignore
            input.next !== 33 /* '!' */ &&
            // @ts-ignore
            input.next !== 63 /* '?' */ &&
            !isSpace(input.next)
        ) {
            return input.acceptToken(StartTag);
        }
    },
    { contextual: true },
);

function scanTo(type: number, end: string) {
    return new ExternalTokenizer((input) => {
        for (let endPos = 0, len = 0; ; len++) {
            if (input.next < 0) {
                if (len) {
                    input.acceptToken(type);
                }
                break;
            }
            if (input.next == end.charCodeAt(endPos)) {
                endPos++;
                if (endPos == end.length) {
                    if (len > end.length) {
                        input.acceptToken(type, 1 - end.length);
                    }
                    break;
                }
            } else {
                endPos = 0;
            }
            input.advance();
        }
    });
}

export const commentContent = scanTo(_commentContent, "-->");
export const piContent = scanTo(_piContent, "?>");
export const cdataContent = scanTo(_cdataContent, "]]>");
