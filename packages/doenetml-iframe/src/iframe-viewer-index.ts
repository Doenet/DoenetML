// All code in this file will be executed in the context of an iframe
// created by DoenetViewer.
declare const viewerId: string;
declare const doenetViewerProps: Record<string, any>;
declare const doenetViewerPropsSpecified: string[];
// Baked into the srcdoc when the parent component opts into the shared
// core-worker host (#1466). Guarded with `typeof` at the use site so this
// script also works in srcdocs generated without the const.
declare const doenetSharedCoreWorker: boolean | undefined;
declare const ComlinkViewer: {
    expose: Function;
    windowEndpoint: Function;
    releaseProxy: symbol;
};
interface Window {
    renderDoenetViewerToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
    doenetGlobalConfig: Record<string, any>;
}

// Module-scope state below is per-iframe-document: each `<DoenetViewer>` lives
// in its own iframe with its own copy of this module, so there's no risk of
// two wrappers competing over the same singletons. Don't try to host multiple
// viewers inside a single iframe document — they'd alias these mutables.

// Holds the most recent full props bag (serializable props + stable function
// dispatchers — see `currentFunctionProps`) so that `updateViewerProps` can
// produce a new merged bag and re-render without re-sending the function
// proxies from the parent.
let lastAugmentedProps: Record<string, any> | null = null;

// Live registry of the parent's proxied callbacks, keyed by prop name. The
// mounted viewer is never handed these proxies directly; it gets a *stable
// dispatcher* per key (see `getFunctionPropDispatcher`) that reads from this
// registry at call time.
//
// This indirection is what keeps callback-identity churn from re-rendering
// the viewer. A React parent that passes inline arrow callbacks hands the
// wrapper a brand-new closure identity on every render; an identity-only
// change just swaps the entry here — the viewer keeps calling the same stable
// dispatcher, which dereferences the new closure — so no re-render happens
// and a core boot in progress is left undisturbed. (This is the same design
// as the editor entry; see iframe-editor-index.ts for the incident that
// motivated it.)
let currentFunctionProps: Record<string, Function> = {};

// Stable dispatcher per function-prop key. Created lazily and never replaced,
// so the viewer sees a single unchanging callback identity for the life of
// the iframe document even as the underlying proxied closure is swapped
// underneath.
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
        (fn as any)?.[ComlinkViewer.releaseProxy]?.();
    } catch (e) {
        console.warn(
            "iframe DoenetViewer: failed to release stale Comlink proxy",
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

// If the parent DoenetViewer was not given a requestScrollTo prop, the viewer
// gets this default, which messages the parent so it can scroll the host page
// when scroll-only links (with target of the form #anchor) are clicked.
function defaultRequestScrollTo(offset: number) {
    messageParentFromViewer({ type: "scrollTo", offset });
}

// Rebuild `lastAugmentedProps` so its function-typed entries exactly match the
// dispatchers for the current callback set. Used when the *set of keys* changes
// (a callback added or removed) — the one case that needs a re-render so the
// viewer can react to a callback's presence/absence. All function-typed entries
// in `lastAugmentedProps` are dispatchers (or the default requestScrollTo), so
// dropping them and re-adding only the current keys correctly removes a
// vanished callback and adds a new one.
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
    if (!("requestScrollTo" in next)) {
        next.requestScrollTo = defaultRequestScrollTo;
    }
    lastAugmentedProps = next;
}

// The initial DoenetML lives in a `<script type="text/doenetml">` child of
// `#root`. React replaces those children as soon as
// `renderDoenetViewerToContainer` mounts the viewer, so we read it once up
// front and pass it explicitly on every subsequent call. Unlike the editor
// (where post-mount `doenetML` changes are ignored to protect the user's
// in-progress edits), the viewer treats `doenetML` as live: the wrapper sends
// changes through `updateViewerProps` and this variable is updated, letting
// the inner DocViewer re-initialize its core in the same realm.
let currentDoenetMLSource: string | null = null;
function resolveDoenetMLSource(root: Element): string {
    if (currentDoenetMLSource !== null) {
        return currentDoenetMLSource;
    }
    const scriptTag = root.querySelector('script[type="text/doenetml"]');
    currentDoenetMLSource = scriptTag?.innerHTML ?? "";
    return currentDoenetMLSource;
}

// Wait for the @doenet/standalone bundle to finish evaluating and
// define `window.renderDoenetViewerToContainer`. Returns true on
// success, false if the function never appears within `timeoutMs`.
//
// See the equivalent in iframe-editor-index.ts for the full motivation.
// The short version: the standalone bundle and this inline module load
// in parallel, the inline module finishes first, and if we signalled
// `iframeReady` before the bundle was loaded the parent's Comlink
// `renderViewerWithFunctionProps` call could race ahead of
// `window.renderDoenetViewerToContainer` being defined and throw
// silently inside the iframe.
async function waitForStandaloneBundle(timeoutMs: number): Promise<boolean> {
    if (typeof window.renderDoenetViewerToContainer === "function") {
        return true;
    }
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (typeof window.renderDoenetViewerToContainer === "function") {
            return true;
        }
    }
    return false;
}

ComlinkViewer.expose(
    {
        renderViewerWithFunctionProps,
        updateViewerProps(updatedSerializableProps: Record<string, any>) {
            if (!lastAugmentedProps) {
                console.warn(
                    "iframe DoenetViewer: updateViewerProps arrived before renderViewerWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            // `doenetML` travels in the same snapshot as the other
            // serializable props but is passed to
            // `renderDoenetViewerToContainer` as the source argument, not
            // inside the config bag.
            const { doenetML, ...rest } = updatedSerializableProps;
            if (typeof doenetML === "string") {
                currentDoenetMLSource = doenetML;
            }
            lastAugmentedProps = {
                ...lastAugmentedProps,
                ...rest,
            };
            renderWithLastAugmentedProps();
        },
        updateViewerFunctionProps(...args: (string | Function)[]) {
            // The wrapper sends key/proxy pairs the same way
            // renderViewerWithFunctionProps does (Comlink can't pass proxies
            // as values inside an object, only as direct arguments). Treat the
            // args as a *full replacement* of the live callback set.
            if (!lastAugmentedProps) {
                console.warn(
                    "iframe DoenetViewer: updateViewerFunctionProps arrived before renderViewerWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            const incoming = functionPropArgsToMap(args);
            // Compare key sets *before* swapping — `setCurrentFunctionProps`
            // below overwrites `currentFunctionProps`, so reading `prevKeys`
            // from it must happen first.
            const prevKeys = Object.keys(currentFunctionProps).sort();
            const nextKeys = Object.keys(incoming).sort();
            const keysChanged =
                prevKeys.length !== nextKeys.length ||
                prevKeys.some((key, i) => key !== nextKeys[i]);

            // Swap the live callbacks (releasing replaced/removed proxies).
            setCurrentFunctionProps(incoming);

            // Identity-only change (same keys, new closures) — the common case
            // when a parent passes inline arrow callbacks: the viewer holds
            // stable dispatchers that read `currentFunctionProps` at call time,
            // so the swap above is sufficient. We deliberately do NOT re-render
            // here; re-rendering on every parent render could disturb a core
            // boot in progress (see iframe-editor-index.ts).
            if (keysChanged) {
                // A callback was added or removed: re-render so the viewer can
                // react to which callbacks are present. Rare and not part of
                // the per-render identity churn.
                syncAugmentedFunctionProps();
                renderWithLastAugmentedProps();
            }
        },
    },
    ComlinkViewer.windowEndpoint(globalThis.parent),
);

/**
 * Render the DoenetViewer to the container after reconstructing the props.
 *
 * Reconstruct the props from the serialized `doenetViewerProps` (from which functions have disappeared)
 * and the ComLink proxied functions specified in `args`.
 * Only include the ComLink proxies if the prop was actually specified,
 * so that the DoenetViewer can customize behavior based on the presence of callback
 *
 * Note that Comlink is unable to send proxied functions as an values of an object,
 * but must be direct arguments of the function.
 * To indicate the functions names, the arguments are a series of string key names
 * followed by the proxied function with that name.
 */
function renderViewerWithFunctionProps(...args: (string | Function)[]) {
    setCurrentFunctionProps(functionPropArgsToMap(args));

    const augmentedDoenetViewerProps = { ...doenetViewerProps };
    augmentedDoenetViewerProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetViewerPropsSpecified) {
        if (
            !(propName in doenetViewerProps) &&
            propName in currentFunctionProps
        ) {
            // Hand the viewer a *stable dispatcher*, not the raw proxy, so a
            // later callback-identity swap (via updateViewerFunctionProps)
            // updates `currentFunctionProps` without forcing a re-render.
            augmentedDoenetViewerProps[propName] =
                getFunctionPropDispatcher(propName);
        }
    }

    // If the parent DoenetViewer was not given a requestScrollTo prop,
    // then create a requestScrollTo prop that will message the parent
    // when scroll-only links (with target of the form #anchor) are clicked
    if (!doenetViewerPropsSpecified.includes("requestScrollTo")) {
        augmentedDoenetViewerProps.requestScrollTo = defaultRequestScrollTo;
    }

    lastAugmentedProps = augmentedDoenetViewerProps;
    renderWithLastAugmentedProps();
}

function renderWithLastAugmentedProps() {
    const root = document.getElementById("root")!;
    window.renderDoenetViewerToContainer(
        root,
        resolveDoenetMLSource(root),
        lastAugmentedProps!,
    );
}

/**
 * Route this realm's core creation to the PARENT page's shared worker pool
 * (#1466): install `doenetGlobalConfig.createExternalCoreWorkerPort` so the
 * viewer obtains each core over a locally-minted `MessageChannel` whose far
 * port the parent forwards to a shared host worker's `createCore`. Messages
 * the viewer sends on its port buffer until the core is exposed, so core
 * creation stays synchronous here. `destroy` notifies the parent to release
 * the core (forwarding wedge suspicion for host quarantine).
 *
 * Must run after the standalone bundle has evaluated — the bundle replaces
 * `window.doenetGlobalConfig` — and before anything renders a viewer.
 */
function installSharedCorePortProvider() {
    let coreCounter = 0;
    window.doenetGlobalConfig.createExternalCoreWorkerPort = () => {
        const coreId = `${viewerId}-core-${++coreCounter}`;
        const channel = new MessageChannel();
        window.parent.postMessage(
            { origin: viewerId, data: { type: "createSharedCore", coreId } },
            window.parent.origin,
            [channel.port2],
        );
        return {
            port: channel.port1,
            destroy: (suspectWedge?: boolean) => {
                messageParentFromViewer({
                    type: "destroySharedCore",
                    coreId,
                    suspectWedge: Boolean(suspectWedge),
                });
            },
        };
    };
}

// Defer `iframeReady` until the standalone bundle has defined
// `renderDoenetViewerToContainer`. See `waitForStandaloneBundle` above.
//
// The trailing `.catch(...)` is required by repo convention (AGENTS.md:
// no fire-and-forget Promises). See the editor counterpart for the full
// rationale — nothing inside is expected to throw, but an unhandled
// rejection inside the iframe is hard to diagnose, so log locally and
// try to surface an error to the parent.
(async () => {
    if (await waitForStandaloneBundle(60_000)) {
        if (
            typeof doenetSharedCoreWorker !== "undefined" &&
            doenetSharedCoreWorker
        ) {
            installSharedCorePortProvider();
        }
        messageParentFromViewer({ iframeReady: true });
    } else {
        messageParentFromViewer({
            error: "Invalid DoenetML version or DoenetML package not found",
        });
    }
})().catch((err) => {
    console.error(
        "iframe DoenetViewer: unexpected failure while signalling iframeReady",
        err,
    );
    try {
        messageParentFromViewer({
            error: "iframe viewer failed to initialize",
        });
    } catch {
        // Last-resort fallback — see the editor counterpart.
    }
});

/**
 * Send a message to the parent React component.
 * @param data
 */
function messageParentFromViewer(data: any) {
    window.parent.postMessage(
        {
            origin: viewerId,
            data,
        },
        window.parent.origin,
    );
}
