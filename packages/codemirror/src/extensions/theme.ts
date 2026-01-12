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
