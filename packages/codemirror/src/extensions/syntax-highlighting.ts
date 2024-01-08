import { LRLanguage, LanguageSupport, foldNodeProp, indentNodeProp } from "@codemirror/language";
import { parser } from "@doenet/parser";
import { styleTags, tags as t } from "@lezer/highlight";

const parserWithMetadata = parser.configure({
    props: [
        indentNodeProp.add({
            //fun (unfixable?) glitch: If you modify the document and then create a newline before enough time has passed for a new parse (which is often < 50ms)
            //the indent wont have time to update and you're going right back to the left side of the screen.
            Element(context) {
                let closed = /^\s*<\//.test(context.textAfter);
                return (
                    context.lineIndent(context.node.from) +
                    (closed ? 0 : context.unit)
                );
            },
            "OpenTag CloseTag SelfClosingTag"(context) {
                if (context.node.firstChild?.name == "TagName") {
                    return context.column(context.node.from);
                }
                return context.column(context.node.from) + context.unit;
            },
        }),
        foldNodeProp.add({
            Element(subtree) {
                let first = subtree.firstChild;
                let last = subtree.lastChild;
                if (!first || first.name != "OpenTag") return null;
                return {
                    from: first.to,
                    to: last?.name == "CloseTag" ? last.from : subtree.to,
                };
            },
        }),
        styleTags({
            AttributeValue: t.string,
            Text: t.content,
            TagName: t.tagName,
            MismatchedCloseTag: t.invalid,
            "StartTag StartCloseTag EndTag SelfCloseEndTag": t.angleBracket,
            "MismatchedCloseTag/TagName": [t.tagName, t.invalid],
            "MismatchedCloseTag/StartCloseTag": t.invalid,
            AttributeName: t.propertyName,
            Is: t.definitionOperator,
            "EntityReference CharacterReference": t.character,
            Comment: t.blockComment,
            Macro: t.macroName,
        }),
    ],
});

const doenetLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/,
    },
});

export const syntaxHighlightingExtension = new LanguageSupport(doenetLanguage);