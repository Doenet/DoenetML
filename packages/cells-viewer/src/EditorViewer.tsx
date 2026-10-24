import React from "react";
import { VscRefresh } from "react-icons/vsc";
import type { CellStore } from "./core";
import { CellsViewer } from "./CellsViewer";
import { editorReady } from "./editor-gate";
import { ResizablePanelPair } from "./ResizablePanelPair";
import { measure } from "./trace";
import "@doenet/codemirror/style.css";
import "./EditorViewer.css";

const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

type CodeMirrorProps = React.ComponentProps<
    typeof import("@doenet/codemirror").CodeMirror
>;

/** CodeMirror with lsp-tools and the language server: a chunk of its own,
 * imported once the first document has rendered (`editor-gate.ts`), so the
 * document never waits for it. Its first mount is the step `editor`. */
const Editor = React.lazy(async () => {
    await editorReady;
    const { CodeMirror } = await import("@doenet/codemirror");
    return {
        default: function Editor(props: CodeMirrorProps) {
            return (
                <EditorMountStep>
                    <CodeMirror {...props} />
                </EditorMountStep>
            );
        },
    };
});

/**
 * A source editor and the rendered document side by side, in the shape of
 * `packages/doenetml-prototype`'s `EditorViewer`: a strip with a Refresh
 * button (also Ctrl/Cmd+S) and the status, the editor on the left and the
 * viewer on the right. Loading is the caller's: it owns the source, the
 * store and what the header reports, so `dev/main.tsx` can also load
 * pre-encoded fixtures.
 */
export function EditorViewer({
    source,
    onSourceChange,
    canRefresh,
    onRefresh,
    store,
    error,
    status,
}: {
    /** The text in the editor. */
    source: string;
    onSourceChange: (source: string) => void;
    /** Whether the editor differs from what is rendered. */
    canRefresh: boolean;
    /** Render the editor's text. */
    onRefresh: () => void;
    store: CellStore | null;
    /** The error of the last load, if it failed. */
    error: string | null;
    /** Shown in the strip beside the Refresh button: the timings. */
    status?: React.ReactNode;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const refresh = React.useRef(onRefresh);
    refresh.current = onRefresh;
    const refreshable = React.useRef(canRefresh);
    refreshable.current = canRefresh;

    React.useEffect(() => {
        const container = ref.current;
        if (!container) return;
        function onKeyDown(event: KeyboardEvent) {
            if ((event.ctrlKey || event.metaKey) && event.key === "s") {
                event.preventDefault();
                event.stopPropagation();
                if (refreshable.current) refresh.current();
            }
        }
        container.addEventListener("keydown", onKeyDown);
        return () => container.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="editor-viewer" ref={ref} tabIndex={-1}>
            <div className="editor-viewer-statusbar">
                <button
                    className="editor-viewer-refresh"
                    disabled={!canRefresh}
                    title={
                        canRefresh
                            ? `Refresh the rendered code ${isMac ? "cmd+s" : "ctrl+s"}`
                            : "The code has not changed since the last render"
                    }
                    onClick={onRefresh}
                >
                    <VscRefresh /> Refresh
                </button>
                {status}
            </div>
            <div className="editor-viewer-panels">
                <ResizablePanelPair
                    panelA={
                        <div className="editor-panel">
                            <React.Suspense fallback={null}>
                                <Editor
                                    value={source}
                                    onChange={(text) => {
                                        if (text !== source)
                                            onSourceChange(text);
                                    }}
                                />
                            </React.Suspense>
                        </div>
                    }
                    panelB={
                        <div className="viewer-panel">
                            {error && (
                                <pre className="viewer-error">{error}</pre>
                            )}
                            {store && <CellsViewer store={store} />}
                        </div>
                    }
                />
            </div>
        </div>
    );
}

/** Records the editor's first mount as the step `editor`: from this
 * component's first render (with the editor's code in hand) until its
 * effects run, which is after the editor's own (React runs a child's
 * effects before its parent's). */
function EditorMountStep({ children }: { children: React.ReactNode }) {
    const [start] = React.useState(() => performance.now());
    React.useEffect(() => {
        measure("editor", start);
    }, [start]);
    return <>{children}</>;
}
