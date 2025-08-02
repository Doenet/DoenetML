import { EditorView } from "@codemirror/view";

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
        color: "black",
        border: "none",
    },
    ".cm-activeLine": {
        backgroundColor: "#50505020",
        color: "black",
    },
});

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
        color: "black",
        border: "none",
    },
    ".cm-activeLine": {
        backgroundColor: "var(--mainGray)",
        color: "black",
    },
    ".cm-line": {
        color: "#666666",
    },
});
