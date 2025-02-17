// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
declare const editorId: string;
declare const doenetEditorProps: object;
declare const haveEditorCallbacks: string[];
interface Window {
    renderDoenetEditorToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
}

document.addEventListener("DOMContentLoaded", () => {
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
    ];
    for (const callback of callbackNames) {
        callbackOverrides[callback] = haveEditorCallbacks.includes(callback)
            ? (args: unknown) => {
                  messageParentFromEditor({
                      callback,
                      args,
                  });
              }
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
