/**
 * Queueing stubs for the render globals, installed by the entry facade's
 * synchronous prologue.
 *
 * The code-split facade awaits its eager chunk through a dynamic import (see
 * `scripts/pin-chunk-urls-plugin.ts` — the await is what lets the chunk URL be
 * version-pinned at load time), and a module script's `load` event fires when
 * evaluation *suspends* at the first `await`, not when it completes. PreTeXt
 * pages hang their render call on exactly that event:
 *
 *     <script onload="onLoad()" type="module" src="…/doenet-standalone.js">
 *     …
 *     function onLoad() {
 *         window.renderDoenetViewerToContainer(
 *             document.querySelector(".doenetml-applet"));
 *     }
 *
 * So at `onload` time the real functions — installed by the eager chunk's
 * module body — may not exist yet. This installer runs before the facade's
 * first `await` and puts a queueing stub at each render global: calls made
 * between `load` and the eager chunk's evaluation are recorded, and the
 * facade flushes them through the real functions the moment the awaited
 * import settles. The editor stub returns a handle whose method calls queue
 * the same way and replay against the real handle on flush — same contract as
 * the real `renderDoenetEditorToContainer`, which itself queues handle
 * actions until the editor mounts.
 *
 * Each stub carries `__doenetPendingRenderStub: true` so a host that *polls*
 * for the globals can keep waiting for the real thing:
 * `@doenet/doenetml-iframe`'s `waitForStandaloneBundle` (in
 * `iframe-viewer-index.ts` / `iframe-editor-index.ts`) checks the marker by
 * this exact name, which is why the property is part of the bundle's
 * public surface and must not be renamed casually.
 *
 * The palette-discovery globals (`getDoenetStylePalettes`,
 * `getDoenetStylePalette`) are not stubbed: they answer with data, which does
 * not exist until the eager chunk evaluates, and their documented contract is
 * feature detection — `typeof … === "function"` means the answer is real.
 *
 * `window.doenetGlobalConfig` is the remaining `onload`-time surface: hosts
 * set boot/worker knobs (and test seams) on it from the same event. The
 * installer pre-creates it as an empty object, and `global-config.ts` in
 * `@doenet/doenetml` adopts that same object when the eager chunk evaluates —
 * so `onload`-time writes are honored and captured references stay live.
 *
 * Injected into the facade as a stringified function (the same mechanism as
 * the pin helper), so **everything here must be self-contained**: no imports,
 * no references outside the function's own scope and standard globals.
 */

/** The window-ish object the render globals live on. */
type RenderGlobals = {
    renderDoenetViewerToContainer?: (...args: unknown[]) => unknown;
    renderDoenetEditorToContainer?: (...args: unknown[]) => unknown;
    doenetGlobalConfig?: object;
};

/**
 * Install queueing stubs for the render globals on `w`, and return the flush
 * function the facade calls once the eager chunk has evaluated.
 *
 * A global that already holds a function (another copy of this bundle on the
 * same page, whether real or an earlier stub) is left alone; calls keep going
 * to that copy, and this facade's flush then has nothing of its own to
 * replay.
 *
 * Flushing replays queued calls in order through whatever the globals hold
 * *at flush time* — normally the real functions the eager chunk just
 * installed. If a global still holds this installer's own stub (nothing
 * replaced it — the import failed in a way that still reached the flush),
 * its queue is left in place rather than re-entered.
 */
export function installFacadeRenderQueue(w: RenderGlobals): () => void {
    type QueuedViewerCall = { args: unknown[] };
    type QueuedEditorCall = {
        args: unknown[];
        methodCalls: { method: string; args: unknown[] }[];
        realHandle: Record<string, (...a: unknown[]) => unknown> | null;
    };
    const viewerQueue: QueuedViewerCall[] = [];
    const editorQueue: QueuedEditorCall[] = [];

    function viewerStub(...args: unknown[]): void {
        viewerQueue.push({ args });
    }
    viewerStub.__doenetPendingRenderStub = true;

    function editorStub(...args: unknown[]) {
        const call: QueuedEditorCall = {
            args,
            methodCalls: [],
            realHandle: null,
        };
        editorQueue.push(call);
        // The handle contract of the real function: three methods, callable
        // immediately. Queue them; forward directly once flush has the real
        // handle (so a handle cached across the flush keeps working).
        function makeMethod(method: string) {
            return (...methodArgs: unknown[]) => {
                if (call.realHandle) {
                    call.realHandle[method](...methodArgs);
                } else {
                    call.methodCalls.push({ method, args: methodArgs });
                }
            };
        }
        return {
            openDiagnosticsTab: makeMethod("openDiagnosticsTab"),
            closeDiagnosticsPanel: makeMethod("closeDiagnosticsPanel"),
            updateRenderedView: makeMethod("updateRenderedView"),
        };
    }
    editorStub.__doenetPendingRenderStub = true;

    const installedViewer =
        typeof w.renderDoenetViewerToContainer !== "function";
    if (installedViewer) {
        w.renderDoenetViewerToContainer = viewerStub;
    }
    const installedEditor =
        typeof w.renderDoenetEditorToContainer !== "function";
    if (installedEditor) {
        w.renderDoenetEditorToContainer = editorStub;
    }
    // The other global hosts touch from `onload`: `window.doenetGlobalConfig`
    // (boot/worker knobs, test seams). Pre-create it so those writes have an
    // object to land on; the eager chunk's `global-config.ts` adopts this
    // same object — identity preserved, defaults filled in around the host's
    // values — so references a host captured at `onload` stay live.
    if (
        typeof w.doenetGlobalConfig !== "object" ||
        w.doenetGlobalConfig === null
    ) {
        w.doenetGlobalConfig = {};
    }

    return function flush(): void {
        const realViewer = w.renderDoenetViewerToContainer;
        if (
            installedViewer &&
            typeof realViewer === "function" &&
            realViewer !== (viewerStub as unknown)
        ) {
            for (const { args } of viewerQueue.splice(0)) {
                realViewer(...args);
            }
        }
        const realEditor = w.renderDoenetEditorToContainer;
        if (
            installedEditor &&
            typeof realEditor === "function" &&
            realEditor !== (editorStub as unknown)
        ) {
            for (const call of editorQueue.splice(0)) {
                const handle = realEditor(...call.args) as Record<
                    string,
                    (...a: unknown[]) => unknown
                > | null;
                if (!handle) {
                    continue;
                }
                call.realHandle = handle;
                for (const { method, args } of call.methodCalls.splice(0)) {
                    handle[method](...args);
                }
            }
        }
    };
}
