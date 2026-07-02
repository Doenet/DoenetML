// All code in this file will be executed in the context of an iframe
// created by DoenetViewer.
declare const viewerId: string;
declare const doenetViewerProps: Record<string, any>;
declare const doenetViewerPropsSpecified: string[];
declare const ComlinkViewer: { expose: Function; windowEndpoint: Function };
interface Window {
    renderDoenetViewerToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
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
    { renderViewerWithFunctionProps },
    ComlinkViewer.windowEndpoint(globalThis.parent),
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
function renderViewerWithFunctionProps(...args: (string | Function)[]) {
    const augmentedDoenetViewerProps = { ...doenetViewerProps };
    augmentedDoenetViewerProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetViewerPropsSpecified) {
        if (!(propName in doenetViewerProps)) {
            const idx = args.indexOf(propName);
            if (idx !== -1) {
                augmentedDoenetViewerProps[propName] = args[idx + 1];
            }
        }
    }

    // If the parent DoenetViewer was not given a requestScrollTo prop,
    // then create a requestScrollTo prop that will message the parent
    // when scroll-only links (with target of the form #anchor) are clicked
    if (!doenetViewerPropsSpecified.includes("requestScrollTo")) {
        augmentedDoenetViewerProps.requestScrollTo = (offset: number) => {
            messageParentFromViewer({ type: "scrollTo", offset });
        };
    }

    window.renderDoenetViewerToContainer(
        document.getElementById("root")!,
        undefined,
        augmentedDoenetViewerProps,
    );
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
