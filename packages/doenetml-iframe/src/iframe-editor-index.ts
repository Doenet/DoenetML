// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
import type { DiagnosticsTabId, DoenetEditorHandle } from "@doenet/doenetml";

declare const editorId: string;
declare const doenetEditorProps: Record<string, any>;
declare const doenetEditorPropsSpecified: string[];
declare const ComlinkEditor: {
    expose: Function;
    windowEndpoint: Function;
    releaseProxy: symbol;
};
declare global {
    interface Window {
        renderDoenetEditorToContainer: (
            container: Element,
            doenetMLSource?: string,
            config?: object,
        ) => DoenetEditorHandle | void;
    }
}

// Module-scope state below is per-iframe-document: each `<DoenetEditor>` lives
// in its own iframe with its own copy of this module, so there's no risk of
// two wrappers competing over the same singletons. Don't try to host multiple
// editors inside a single iframe document — they'd alias these mutables.
let editorControlHandle: DoenetEditorHandle | null = null;

// Holds the most recent full props bag (serializable props + stable function
// dispatchers — see `currentFunctionProps`) so that `updateEditorProps` can
// produce a new merged bag and re-render without re-sending the function
// proxies from the parent.
let lastAugmentedProps: Record<string, any> | null = null;

// Live registry of the parent's proxied callbacks, keyed by prop name. The
// mounted editor is never handed these proxies directly; it gets a *stable
// dispatcher* per key (see `getFunctionPropDispatcher`) that reads from this
// registry at call time.
//
// This indirection is what keeps callback-identity churn from re-initializing
// the editor. A React parent that passes inline arrow callbacks hands the
// wrapper a brand-new closure identity on every render, so the wrapper forwards
// `updateEditorFunctionProps` constantly. The old handler re-invoked
// `renderDoenetEditorToContainer` on each such change; when that churn
// overlapped the core worker's boot window the worker never finished booting
// and the editor showed "The document viewer could not be started." Now an
// identity-only change just swaps the entry here — the editor keeps calling the
// same stable dispatcher, which dereferences the new closure — so no re-render
// happens and the boot is left undisturbed.
let currentFunctionProps: Record<string, Function> = {};

// Stable dispatcher per function-prop key. Created lazily and never replaced,
// so the editor sees a single unchanging callback identity for the life of the
// iframe document even as the underlying proxied closure is swapped underneath.
const functionPropDispatchers: Record<string, Function> = {};

function getFunctionPropDispatcher(key: string): Function {
    let dispatcher = functionPropDispatchers[key];
    if (!dispatcher) {
        dispatcher = (...callArgs: any[]) =>
            currentFunctionProps[key]?.(...callArgs);
        functionPropDispatchers[key] = dispatcher;
    }
    return dispatcher;
}

// Parse the `key, proxy, key, proxy, …` argument list the wrapper sends
// (Comlink can't pass proxied functions as object values, only as direct
// args) into a map.
function functionPropArgsToMap(
    args: (string | Function)[],
): Record<string, Function> {
    const map: Record<string, Function> = {};
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const fn = args[i + 1];
        if (typeof key === "string" && typeof fn === "function") {
            map[key] = fn;
        }
    }
    return map;
}

function releaseFunctionProxy(fn: Function) {
    try {
        (fn as any)?.[ComlinkEditor.releaseProxy]?.();
    } catch (e) {
        console.warn(
            "iframe DoenetEditor: failed to release stale Comlink proxy",
            e,
        );
    }
}

// Adopt `incoming` as the live callback set, releasing the Comlink port of
// every previous proxy that is being replaced or dropped (so the parent-side
// MessageChannel closes — Comlink also has a FinalizationRegistry fallback,
// but explicit release avoids depending on GC timing).
function setCurrentFunctionProps(incoming: Record<string, Function>) {
    for (const [key, fn] of Object.entries(currentFunctionProps)) {
        if (incoming[key] !== fn) {
            releaseFunctionProxy(fn);
        }
    }
    currentFunctionProps = incoming;
}

// Rebuild `lastAugmentedProps` so its function-typed entries exactly match the
// dispatchers for the current callback set. Used when the *set of keys* changes
// (a callback added or removed) — the one case that needs a re-render so the
// editor can react to a callback's presence/absence. All function-typed entries
// in `lastAugmentedProps` are dispatchers, so dropping them and re-adding only
// the current keys correctly removes a vanished callback and adds a new one.
function syncAugmentedFunctionProps() {
    if (!lastAugmentedProps) {
        return;
    }
    const next: Record<string, any> = {};
    for (const [key, val] of Object.entries(lastAugmentedProps)) {
        if (typeof val !== "function") {
            next[key] = val;
        }
    }
    for (const key of Object.keys(currentFunctionProps)) {
        next[key] = getFunctionPropDispatcher(key);
    }
    lastAugmentedProps = next;
}

// The initial DoenetML lives in a `<script type="text/doenetml">` child of
// `#root`. React replaces those children as soon as
// `renderDoenetEditorToContainer` mounts the editor, so we read it once up
// front and pass it explicitly on every subsequent call. (We never want the
// `doenetML` prop to change post-mount anyway — see the parent wrapper's
// `initialIframePropsRef` for why.)
let initialDoenetMLSource: string | null = null;
function resolveInitialDoenetMLSource(root: Element): string {
    if (initialDoenetMLSource !== null) {
        return initialDoenetMLSource;
    }
    const scriptTag = root.querySelector('script[type="text/doenetml"]');
    initialDoenetMLSource = scriptTag?.innerHTML ?? "";
    return initialDoenetMLSource;
}

// Wait for the @doenet/standalone bundle to finish evaluating and
// define `window.renderDoenetEditorToContainer`. Returns true on success,
// false if the function never appears within `timeoutMs`.
//
// `iframeReady` MUST be gated on this. The two scripts in the srcDoc —
// the standalone bundle (~32 MB) and this inline editor module — load in
// parallel, and the inline module is tiny enough to finish first. If we
// signalled ready before the bundle was loaded, the parent's Comlink
// `renderEditorWithFunctionProps` call could arrive while
// `window.renderDoenetEditorToContainer` is still undefined; that throws
// inside the iframe, the parent's wrapper catches the rejection silently
// (`.catch(logComlinkError(...))`), and the editor never mounts even
// though the bundle does eventually finish loading.
//
// In practice the bundle is ready within a few hundred ms in most
// contexts. The headroom matters for the iframe-wrapper's srcDoc-rebuild
// path: on slow CI runners the second iframe's V8 isolate re-parses the
// 32 MB bundle from scratch (Chrome's bytecode cache for blob: URLs is
// not always rehydrated across iframe loads) and can take tens of
// seconds before the function is defined. The 60 s ceiling comfortably
// exceeds the srcDocRebuildReplay test's per-cypress-attempt budget
// (REBUILD_INNER_TIMEOUT_MS=15 s) so a healthy-but-slow boot has room
// to finish before either side gives up; the test handles each rebuild
// in a fresh iframe, so this ceiling only needs to cover one boot, not
// a sum across retries.
async function waitForStandaloneBundle(timeoutMs: number): Promise<boolean> {
    if (typeof window.renderDoenetEditorToContainer === "function") {
        return true;
    }
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (typeof window.renderDoenetEditorToContainer === "function") {
            return true;
        }
    }
    return false;
}

ComlinkEditor.expose(
    {
        renderEditorWithFunctionProps,
        updateEditorProps(updatedSerializableProps: Record<string, any>) {
            if (!lastAugmentedProps) {
                console.warn(
                    "iframe DoenetEditor: updateEditorProps arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            lastAugmentedProps = {
                ...lastAugmentedProps,
                ...updatedSerializableProps,
            };
            renderWithLastAugmentedProps();
        },
        updateEditorFunctionProps(...args: (string | Function)[]) {
            // The wrapper sends key/proxy pairs the same way
            // renderEditorWithFunctionProps does (Comlink can't pass proxies
            // as values inside an object, only as direct arguments). Treat the
            // args as a *full replacement* of the live callback set.
            if (!lastAugmentedProps) {
                console.warn(
                    "iframe DoenetEditor: updateEditorFunctionProps arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            const incoming = functionPropArgsToMap(args);
            const prevKeys = Object.keys(currentFunctionProps).sort();
            const nextKeys = Object.keys(incoming).sort();
            const keysChanged =
                prevKeys.length !== nextKeys.length ||
                prevKeys.some((key, i) => key !== nextKeys[i]);

            // Swap the live callbacks (releasing replaced/removed proxies).
            setCurrentFunctionProps(incoming);

            // Identity-only change (same keys, new closures) — the common case
            // when a parent passes inline arrow callbacks: the editor holds
            // stable dispatchers that read `currentFunctionProps` at call time,
            // so the swap above is sufficient. We deliberately do NOT re-render
            // here; re-rendering on every parent render is what wedged the core
            // worker's boot.
            if (keysChanged) {
                // A callback was added or removed: re-render so the editor can
                // react to which callbacks are present. Rare and not part of
                // the per-render identity churn.
                syncAugmentedFunctionProps();
                renderWithLastAugmentedProps();
            }
        },
        openDiagnosticsTab(tabId: DiagnosticsTabId) {
            if (!editorControlHandle) {
                console.warn(
                    "iframe DoenetEditor: openDiagnosticsTab arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            editorControlHandle.openDiagnosticsTab(tabId);
        },
        closeDiagnosticsPanel() {
            if (!editorControlHandle) {
                console.warn(
                    "iframe DoenetEditor: closeDiagnosticsPanel arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            editorControlHandle.closeDiagnosticsPanel();
        },
        updateRenderedView() {
            if (!editorControlHandle) {
                console.warn(
                    "iframe DoenetEditor: updateRenderedView arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            editorControlHandle.updateRenderedView();
        },
    },
    ComlinkEditor.windowEndpoint(globalThis.parent),
);

/**
 * Render the DoenetEditor to the container after reconstructing the props.
 *
 * Reconstruct the props from the serialized `doenetEditorProps` (from which functions have disappeared)
 * and the ComLink proxied functions specified in `args`.
 * Only include the ComLink proxies if the prop was actually specified,
 * so that the DoenetEditor can customize behavior based on the presence of callback
 *
 * Note that Comlink is unable to send proxied functions as an values of an object,
 * but must be direct arguments of the function.
 * To indicate the functions names, the arguments are a series of string key names
 * followed by the proxied function with that name.
 */
function renderEditorWithFunctionProps(...args: (string | Function)[]) {
    setCurrentFunctionProps(functionPropArgsToMap(args));

    const augmentedDoenetEditorProps = { ...doenetEditorProps };
    augmentedDoenetEditorProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetEditorPropsSpecified) {
        if (
            !(propName in doenetEditorProps) &&
            propName in currentFunctionProps
        ) {
            // Hand the editor a *stable dispatcher*, not the raw proxy, so a
            // later callback-identity swap (via updateEditorFunctionProps)
            // updates `currentFunctionProps` without forcing a re-render.
            augmentedDoenetEditorProps[propName] =
                getFunctionPropDispatcher(propName);
        }
    }

    lastAugmentedProps = augmentedDoenetEditorProps;
    renderWithLastAugmentedProps();
}

function renderWithLastAugmentedProps() {
    const root = document.getElementById("root")!;
    const handle = window.renderDoenetEditorToContainer(
        root,
        resolveInitialDoenetMLSource(root),
        lastAugmentedProps!,
    );
    if (handle) {
        editorControlHandle = handle;
    }
}

// Defer `iframeReady` until the standalone bundle has defined
// `renderDoenetEditorToContainer`. See `waitForStandaloneBundle` above
// for why this gate is load-bearing. ComlinkEditor.expose above has
// already run so the Comlink endpoint is wired and ready for the parent
// to call as soon as we signal — there's just no point signalling
// until the function the parent will eventually invoke is in place.
//
// The trailing `.catch(...)` is required by repo convention (AGENTS.md:
// no fire-and-forget Promises). Nothing in the IIFE is expected to
// throw in practice — `waitForStandaloneBundle` only awaits resolved
// setTimeout Promises, and `messageParentFromEditor` is a postMessage
// call — but a future change inside the IIFE could introduce one, and
// an unhandled rejection inside the iframe is hard to diagnose. Log
// locally and try to surface an error to the parent so the wrapper can
// move the user out of the silent-stuck state.
(async () => {
    if (await waitForStandaloneBundle(60_000)) {
        messageParentFromEditor({ iframeReady: true });
    } else {
        messageParentFromEditor({
            error: "Invalid DoenetML version or DoenetML package not found",
        });
    }
})().catch((err) => {
    console.error(
        "iframe DoenetEditor: unexpected failure while signalling iframeReady",
        err,
    );
    try {
        messageParentFromEditor({
            error: "iframe editor failed to initialize",
        });
    } catch {
        // Last-resort fallback — if even postMessage is unavailable
        // here, there's nothing more we can do from inside the iframe.
    }
});

/**
 * Send a message to the parent React component.
 * @param data
 */
function messageParentFromEditor(data: any) {
    window.parent.postMessage(
        {
            origin: editorId,
            data,
        },
        window.parent.origin,
    );
}
