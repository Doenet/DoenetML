export * from "./CodeMirror";
export type { ThemeMode } from "./extensions/theme";
export type {
    DiagnosticPresentation,
    SeverityHeadingKey,
} from "./extensions/lsp/plugin";
export type { LSP } from "./extensions/lsp/worker";
// Re-exported so consumers can build extensions for `CodeMirror`'s
// `extraExtensions` prop without taking their own direct dependency on the
// CodeMirror packages, which would risk resolving a second, incompatible copy.
export { EditorView, keymap } from "@uiw/react-codemirror";
