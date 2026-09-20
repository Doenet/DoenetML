// Dedicated entry point for hosts that use the CodeMirror component directly:
// `import { CodeMirror } from "@doenet/doenetml/codemirror.js"`.
//
// A separate entry rather than a re-export from `index.ts` so that the main
// entry stays free of any static path into the editor stack — the editor's
// weight (codemirror, its inlined LSP worker source, the component schema)
// belongs to the lazy chunk `EditorViewer/EditorViewerLazy.tsx` splits out,
// and this entry shares those same chunks with it.
export * from "@doenet/codemirror";
