// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
declare const editorId: string;
declare const doenetEditorProps: Record<string, any>;
declare const doenetEditorPropsSpecified: string[];
declare const ComlinkEditor: { expose: Function; windowEndpoint: Function };
interface Window {
    renderDoenetEditorToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
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
    { renderEditorWithFunctionProps },
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

    window.renderDoenetEditorToContainer(
        document.getElementById("root")!,
        undefined,
        augmentedDoenetEditorProps,
    );
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
