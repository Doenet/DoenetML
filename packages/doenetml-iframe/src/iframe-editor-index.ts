// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
import type { DiagnosticsTabId, DoenetEditorHandle } from "@doenet/doenetml";

declare const editorId: string;
declare const doenetEditorProps: Record<string, any>;
declare const doenetEditorPropsSpecified: string[];
declare const ComlinkEditor: { expose: Function; windowEndpoint: Function };
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

// Holds the most recent full props bag (serializable props + proxied function
// props) so that `updateEditorProps` can produce a new merged bag and re-render
// without re-sending the function proxies from the parent.
let lastAugmentedProps: Record<string, any> | null = null;

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

document.addEventListener("DOMContentLoaded", async () => {
    let pause100 = function () {
        return new Promise((resolve, _reject) => {
            setTimeout(resolve, 100);
        });
    };

    // wait up to a second window.renderDoenetViewerToContainer to be found
    for (let i = 0; i < 10; i++) {
        if (typeof window.renderDoenetViewerToContainer === "function") {
            break;
        }
        await pause100();
    }

    if (typeof window.renderDoenetEditorToContainer !== "function") {
        return messageParentFromEditor({
            error: "Invalid DoenetML version or DoenetML package not found",
        });
    }
});

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
            // as values inside an object, only as direct arguments). We
            // overwrite the function entries on `lastAugmentedProps` so the
            // next re-render uses the freshest closures from the parent.
            if (!lastAugmentedProps) {
                console.warn(
                    "iframe DoenetEditor: updateEditorFunctionProps arrived before renderEditorWithFunctionProps completed — likely a bug in the iframe wrapper's queue/replay sequencing.",
                );
                return;
            }
            const next: Record<string, any> = { ...lastAugmentedProps };
            for (let i = 0; i < args.length; i += 2) {
                const key = args[i];
                const fn = args[i + 1];
                if (typeof key === "string" && typeof fn === "function") {
                    next[key] = fn;
                }
            }
            lastAugmentedProps = next;
            renderWithLastAugmentedProps();
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
    const augmentedDoenetEditorProps = { ...doenetEditorProps };
    augmentedDoenetEditorProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetEditorPropsSpecified) {
        if (!(propName in doenetEditorProps)) {
            const idx = args.indexOf(propName);
            if (idx !== -1) {
                augmentedDoenetEditorProps[propName] = args[idx + 1];
            }
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

messageParentFromEditor({ iframeReady: true });

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
