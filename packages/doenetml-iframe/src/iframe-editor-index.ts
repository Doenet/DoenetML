// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
declare const editorId: string;
declare const doenetEditorProps: Record<string, any>;
declare const doenetEditorPropsSpecified: string[];
declare const ComlinkEditor: { wrap: Function; windowEndpoint: Function };
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

    // Reconstruct the props from the serialized doenetEditorProps (from which functions have disappeared)
    // and the ComLink proxied functions.
    // Only include the ComLink proxies if the prop was actually specified,
    // so that the DoenetEditor can customize behavior based on the presence of callbacks.
    const wrappedDoenetEditorProps = ComlinkEditor.wrap(
        ComlinkEditor.windowEndpoint(globalThis.parent),
    );

    const augmentedDoenetEditorProps = { ...doenetEditorProps };
    augmentedDoenetEditorProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetEditorPropsSpecified) {
        if (!(propName in doenetEditorProps)) {
            augmentedDoenetEditorProps[propName] =
                wrappedDoenetEditorProps[propName];
        }
    }

    window.renderDoenetEditorToContainer(
        document.getElementById("root")!,
        undefined,
        augmentedDoenetEditorProps,
    );
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
