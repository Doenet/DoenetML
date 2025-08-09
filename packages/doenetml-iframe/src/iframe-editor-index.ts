// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
declare const editorId: string;
declare const doenetEditorProps: object;
declare const haveEditorCallbacks: string[];
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

    // Callbacks have to be explicitly overridden here so that they
    // can message the parent React component (outside the iframe).
    const callbackOverrides: Record<
        string,
        ((args: unknown) => void) | undefined
    > = {};
    const callbackNames = [
        "doenetmlChangeCallback",
        "immediateDoenetmlChangeCallback",
        "documentStructureCallback",
        "fetchExternalDoenetML",
    ];
    const wrappedCallbacks = ComlinkEditor.wrap(
        ComlinkEditor.windowEndpoint(self.parent),
    );
    for (const callback of callbackNames) {
        callbackOverrides[callback] = haveEditorCallbacks.includes(callback)
            ? wrappedCallbacks[callback]
            : undefined;
    }

    window.renderDoenetEditorToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetEditorProps,
            externalVirtualKeyboardProvided: true,
            ...callbackOverrides,
        },
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
