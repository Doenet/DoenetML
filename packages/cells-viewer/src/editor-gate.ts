// When the editor's code loads. CodeMirror, lsp-tools and the language
// server are a chunk of their own (`EditorViewer.tsx`), imported once this
// resolves: after the page's first document has rendered, so the document
// is not made to wait for the editor's download and evaluation.
// `dev/main.tsx` releases it when its first load ends, however it ends;
// a page with nothing to load releases it at once. A load that hangs
// releases it after `EDITOR_WAIT_MS`, so the editor always comes.

const EDITOR_WAIT_MS = 5000;

let release: () => void = () => {};

/** Resolves when the editor may load. */
export const editorReady = new Promise<void>((resolve) => {
    release = resolve;
});

export function releaseEditor() {
    release();
}

setTimeout(releaseEditor, EDITOR_WAIT_MS);
