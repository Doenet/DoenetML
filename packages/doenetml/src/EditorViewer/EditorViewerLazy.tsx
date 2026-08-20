import React, { Suspense } from "react";
import type { EditorViewer } from "./EditorViewer";
import { importRendererWithRetry } from "../Viewer/renderersLoadComponent";

type EditorViewerProps = React.ComponentPropsWithoutRef<typeof EditorViewer>;
type EditorViewerHandle = React.ComponentRef<typeof EditorViewer>;

/**
 * The editor stack's code-splitting boundary.
 *
 * `EditorViewer` carries the heaviest main-thread dependencies in the bundle —
 * `@doenet/codemirror` (with its inlined LSP worker source), the pretty
 * printer, the diagnostics/context-help UI, and the component schema they
 * read. This lazy import keeps all of that in its own chunk, loaded on the
 * first mount of an editor, so a viewer-only page never parses it. Both
 * routes into the editor go through here: the `DoenetEditor` component in
 * `doenetml.tsx`, and the `<codeEditor>` renderer.
 *
 * The chunk fetch is wrapped in the same transient-failure retry the viewer
 * renderer chunks use (see `renderersLoadComponent.tsx`).
 */
const LazyInner = React.lazy(async () => {
    const module = await importRendererWithRetry(
        () => import("./EditorViewer"),
        "EditorViewer",
    );
    return { default: module.EditorViewer };
});

/**
 * Drop-in stand-in for `EditorViewer` that loads it on first mount. Renders
 * nothing while the chunk is in flight; the ref attaches once the real
 * component mounts, which the imperative-handle plumbing in
 * `@doenet/standalone` already tolerates (it queues handle actions until the
 * ref fires).
 */
export const EditorViewerLazy = React.forwardRef<
    EditorViewerHandle,
    EditorViewerProps
>(function EditorViewerLazy(props, ref) {
    return (
        <Suspense fallback={null}>
            <LazyInner ref={ref} {...props} />
        </Suspense>
    );
});
