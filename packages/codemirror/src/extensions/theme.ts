import { EditorView } from "@codemirror/view";

export const colorTheme = EditorView.theme({
    "&": {
        color: "var(--canvastext)",
        height: "100%",
        //backgroundColor: "var(--canvas)",
    },
    ".cm-content": {
        caretColor: "#0e9",
        borderDownColor: "var(--canvastext)",
    },
    ".cm-editor": {
        caretColor: "#0e9",
        backgroundColor: "var(--canvas)",
    },
    "&.cm-focused .cm-cursor": {
        backgroundColor: "var(--lightBlue)",
        borderLeftColor: "var(--canvastext)",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "var(--mainGray)",
    },
    "&.cm-focused": {
        color: "var(--canvastext)",
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
});
