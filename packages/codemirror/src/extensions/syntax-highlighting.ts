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
import type { ThemeMode } from "./theme";

const parserWithMetadata = parser.configure({
    props: [
        indentNodeProp.add({
            // Indentation depends on the latest parse tree. If the user edits
            // the document and immediately inserts a newline before the parser
            // catches up (usually within a few tens of milliseconds), the new
            // line can momentarily fall back to column 0.
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
type SyntaxColors = {
    string: string;
    tagName: string;
    propertyName: string;
    invalid: string;
    blockComment: string;
    macroName: string;
    content: string;
};

// Keep the tag-to-color mapping in one place so light/dark palettes can't drift.
function createHighlightStyle(colors: SyntaxColors) {
    return HighlightStyle.define([
        { tag: t.string, color: colors.string },
        { tag: t.tagName, color: colors.tagName },
        { tag: t.angleBracket, color: colors.tagName },
        { tag: t.propertyName, color: colors.propertyName },
        { tag: t.invalid, color: colors.invalid },
        { tag: t.blockComment, color: colors.blockComment },
        { tag: t.macroName, color: colors.macroName },
        { tag: t.content, color: colors.content },
        { tag: t.definitionOperator, color: colors.content },
        { tag: t.character, color: colors.tagName },
    ]);
}

// WCAG 2.1 AA compliant color scheme for syntax highlighting.
// Every color clears 4.5:1 on the white canvas and on the light match tint in
// `theme.ts` (#e2edfc), which is painted behind tokens that keep these colors.
// The selection fill is not in that list: text inside a selection is recolored
// to a single value, so this palette never has to clear it.
const customHighlightStyle = createHighlightStyle({
    string: "#00732f", // Dark green - 6.01:1 on white, 5.08:1 on the match tint
    tagName: "#0550ae", // Blue - 7.59:1 on white
    propertyName: "#953800", // Burnt orange - 7.39:1 on white
    invalid: "#a80000", // Dark red - 7.88:1 on white
    blockComment: "#5c636d", // Gray - 6.07:1 on white
    macroName: "#6f42c1", // Purple - 6.51:1 on white
    content: "#24292f", // Near black - 14.65:1 on white
});
const doenetLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/,
    },
});

// Dark canvas (#121212) syntax highlight palette — GitHub-dark-inspired.
// All colors verified for ≥4.5:1 WCAG AA contrast on #121212.
//
// The dimmest color here also decides how strong the match tint in `theme.ts`
// may be: that tint is painted behind tokens that keep these colors, so the
// dimmest one is the first to fall below AA on top of it. At GitHub's comment
// gray #8b949e (6.09:1 on the canvas) the tint could not exceed 1.35:1 against
// the canvas without taking comments under AA — about where the old selection
// sat when authors reported seeing no highlight at all. A shade lighter lifts
// that ceiling to 1.65:1, room enough for a tint that registers, while leaving
// comments plainly quieter than body content.
const darkHighlightStyle = createHighlightStyle({
    string: "#56d364", // green  9.72:1 on #121212
    tagName: "#79c0ff", // blue   9.63:1 on #121212
    propertyName: "#ffa657", // orange 9.67:1 on #121212
    invalid: "#ff7b72", // red    7.43:1 on #121212
    blockComment: "#9ba4ad", // gray   7.41:1 on #121212 — the dimmest
    macroName: "#d2a8ff", // purple 9.62:1 on #121212
    content: "#e6edf3", // near-white 15.85:1 on #121212
});

export function syntaxHighlightingExtension(darkMode: ThemeMode) {
    return new LanguageSupport(doenetLanguage, [
        syntaxHighlighting(
            darkMode === "dark" ? darkHighlightStyle : customHighlightStyle,
        ),
    ]);
}
