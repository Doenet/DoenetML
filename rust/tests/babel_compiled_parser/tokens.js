"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.startTag = exports.elementContext = exports.commentContent = void 0;

var _lr = require("@lezer/lr");

var _doenetTerms = require("./doenet.terms.js");

/* Hand-written tokenizer for XML tag matching. */
function nameChar(ch) {
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

function isSpace(ch) {
    return ch == 9 || ch == 10 || ch == 13 || ch == 32;
}

let cachedName = null,
    cachedInput = null,
    cachedPos = 0;

function tagNameAfter(input, offset) {
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

function ElementContext(name, parent) {
    this.name = name;
    this.parent = parent;
    this.hash = parent ? parent.hash : 0;

    for (let i = 0; i < name.length; i++)
        this.hash +=
            (this.hash << 4) + name.charCodeAt(i) + (name.charCodeAt(i) << 8);
}

const elementContext = new _lr.ContextTracker({
    start: null,

    shift(context, term, stack, input) {
        return term == _doenetTerms.StartTag
            ? new ElementContext(tagNameAfter(input, 1) || "", context)
            : context;
    },

    reduce(context, term) {
        return term == _doenetTerms.Element && context
            ? context.parent
            : context;
    },

    reuse(context, node, _stack, input) {
        let type = node.type.id;
        return type == _doenetTerms.StartTag || type == _doenetTerms.OpenTag
            ? new ElementContext(tagNameAfter(input, 1) || "", context)
            : context;
    },

    hash(context) {
        return context ? context.hash : 0;
    },

    strict: false,
});
exports.elementContext = elementContext;
const startTag = new _lr.ExternalTokenizer(
    (input, stack) => {
        if (
            input.next != 60
            /* '<' */
        )
            return;
        input.advance();

        if (
            input.next == 47
            /* '/' */
        ) {
            input.advance();
            let name = tagNameAfter(input, 0);
            if (!name)
                return input.acceptToken(_doenetTerms.incompleteStartCloseTag);
            if (
                stack.context &&
                name.toLowerCase() == stack.context.name.toLowerCase()
            )
                return input.acceptToken(_doenetTerms.StartCloseTag);

            for (let cx = stack.context; cx; cx = cx.parent)
                if (cx.name == name)
                    return input.acceptToken(_doenetTerms.MissingCloseTag, -2);

            input.acceptToken(_doenetTerms.mismatchedStartCloseTag);
        } else if (
            input.next != 33 &&
            /* '!' */
            input.next != 63 &&
            /* '?' */
            !isSpace(input.next)
        ) {
            return input.acceptToken(_doenetTerms.StartTag);
        }
    },
    {
        contextual: true,
    }
);
exports.startTag = startTag;

function scanTo(type, end) {
    return new _lr.ExternalTokenizer((input) => {
        for (let endPos = 0, len = 0; ; len++) {
            if (input.next < 0) {
                if (len) input.acceptToken(type);
                break;
            }

            if (input.next == end.charCodeAt(endPos)) {
                endPos++;

                if (endPos == end.length) {
                    if (len > end.length)
                        input.acceptToken(type, 1 - end.length);
                    break;
                }
            } else {
                endPos = 0;
            }

            input.advance();
        }
    });
}

const commentContent = scanTo(_doenetTerms.commentContent, "-->");
exports.commentContent = commentContent;
