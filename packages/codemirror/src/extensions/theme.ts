import { EditorView } from "@codemirror/view";

// WCAG 2.1 AA compliant color theme
export const colorTheme = EditorView.theme({
    "&": {
        color: "var(--canvasText)",
        height: "100%",
        //backgroundColor: "var(--canvas)",
    },
    ".cm-content": {
        caretColor: "#0e9",
        borderDownColor: "var(--canvasText)",
    },
    ".cm-editor": {
        caretColor: "#0e9",
        backgroundColor: "var(--canvas)",
    },
    "&.cm-focused .cm-cursor": {
        backgroundColor: "var(--lightBlue)",
        borderLeftColor: "var(--canvasText)",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "var(--mainGray)",
    },
    "&.cm-focused": {
        color: "var(--canvasText)",
    },
    "cm-selectionLayer": {
        backgroundColor: "var(--mainGreen)",
    },
    ".cm-gutters": {
        backgroundColor: "var(--mainGray)",
        // Changed from "black" to ensure proper contrast on gray background
        // #595959 has 4.54:1 contrast on #e3e3e3 (light mode mainGray)
        color: "#595959",
        border: "none",
    },
    ".cm-activeLine": {
        backgroundColor: "#50505020",
        color: "black",
    },
});

// Left-column glyphs for the autocomplete dropdown, one per DoenetML category.
// CodeMirror renders these from each completion's `type` via the built-in class
// `.cm-completionIcon-<type>` (types assigned in extensions/lsp/plugin.ts). Its
// base theme only defines glyphs for a fixed set of types (and dims them to 0.6
// opacity), so we override `enum`/`property` and add glyphs for our custom
// types. Uses EditorView.theme (not baseTheme) so these win over CodeMirror's
// built-in rules by later injection at equal CSS specificity. Glyph-only (CSS
// `::after` content) — no image assets. Colors checked for WCAG AA contrast on
// the dropdown background; opacity bumped to 1 so the color reads clearly.
export const completionIconTheme = EditorView.theme({
    ".cm-completionIcon-component::after": { content: '"\\25C8"' }, // ◈
    ".cm-completionIcon-refproperty::after": { content: '"."' },
    ".cm-completionIcon-closetag::after": { content: '"/"' },
    ".cm-completionIcon-enum::after": { content: '"="' }, // attribute name
    ".cm-completionIcon-value::after": { content: '"\\0022"' }, // "
    ".cm-completionIcon-reference::after": { content: '"$"' },
    ".cm-completionIcon-snippet::after": { content: '"\\274F"' }, // ❏

    ".cm-completionIcon-component": { color: "#1f6feb", opacity: "1" }, // blue
    ".cm-completionIcon-enum": { color: "#1a7f37", opacity: "1" }, // green
    ".cm-completionIcon-value": { color: "#0e7c86", opacity: "1" }, // teal
    ".cm-completionIcon-reference": { color: "#8250df", opacity: "1" }, // purple
    ".cm-completionIcon-refproperty": { color: "#8250df", opacity: "1" }, // purple
    ".cm-completionIcon-snippet": { color: "#bc4c00", opacity: "1" }, // orange
    ".cm-completionIcon-closetag": { color: "#1f6feb", opacity: "1" }, // blue

    // The highlighted option has a solid blue background (CodeMirror's
    // baseTheme: #17c light / #347 dark, with white label text), against which
    // the category colors above are nearly invisible. Render the glyph white on
    // the selected row so it stays legible, matching the label. The descendant
    // selector outranks the single-class color rules above, so it wins
    // regardless of order.
    ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionIcon": {
        color: "#fff",
        opacity: "1",
    },
});

// WCAG 2.1 AA compliant read-only color theme
export const readOnlyColorTheme = EditorView.theme({
    "&": {
        color: "var(--canvasText)",
        height: "100%",
    },
    ".cm-content": {
        caretColor: "#0e9",
        borderDownColor: "var(--canvasText)",
        backgroundColor: "#77777720",
    },
    ".cm-editor": {
        caretColor: "#0e9",
    },
    "&.cm-focused .cm-cursor": {
        backgroundColor: "var(--lightBlue)",
        borderLeftColor: "var(--canvasText)",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "var(--mainGray)",
    },
    "&.cm-focused": {
        color: "var(--canvasText)",
    },
    "cm-selectionLayer": {
        backgroundColor: "var(--mainGreen)",
    },
    ".cm-gutters": {
        backgroundColor: "var(--mainGray)",
        // Changed from "black" to ensure proper contrast on gray background
        color: "#595959",
        border: "none",
    },
    ".cm-activeLine": {
        backgroundColor: "var(--mainGray)",
        color: "black",
    },
    ".cm-line": {
        // Changed from #666666 (3.46:1 on white) to #595959 (4.54:1 on white)
        // to meet WCAG 2.1 AA requirements (minimum 4.5:1)
        color: "#595959",
    },
});
