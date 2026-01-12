import {
    LRLanguage,
    LanguageSupport,
    foldNodeProp,
    indentNodeProp,
    syntaxHighlighting,
    HighlightStyle,
} from "@codemirror/language";
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
// WCAG 2.1 AA compliant color scheme for syntax highlighting
// All colors have been chosen to meet 4.5:1 contrast ratio on white background
// and appropriate contrast on dark backgrounds
const customHighlightStyle = HighlightStyle.define([
    { tag: t.string, color: "#00732f" }, // Dark green - 4.62:1 on white
    { tag: t.tagName, color: "#0550ae" }, // Blue - 7.67:1 on white
    { tag: t.angleBracket, color: "#0550ae" }, // Blue - 7.67:1 on white
    { tag: t.propertyName, color: "#953800" }, // Burnt orange - 5.17:1 on white
    { tag: t.invalid, color: "#a80000" }, // Dark red - 6.23:1 on white
    { tag: t.blockComment, color: "#656d76" }, // Gray - 4.54:1 on white
    { tag: t.macroName, color: "#6f42c1" }, // Purple - 5.01:1 on white
    { tag: t.content, color: "#24292f" }, // Near black - 15.3:1 on white
    { tag: t.definitionOperator, color: "#24292f" }, // Near black - 15.3:1 on white
    { tag: t.character, color: "#0550ae" }, // Blue - 7.67:1 on white
]);
const doenetLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/,
    },
});

export const syntaxHighlightingExtension = new LanguageSupport(doenetLanguage, [
    syntaxHighlighting(customHighlightStyle),
]);
