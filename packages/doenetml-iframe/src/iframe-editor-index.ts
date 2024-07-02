// All code in this file will be executed in the context of an iframe
// created by DoenetEditor.
declare const editorId: string;
declare const doenetEditorProps: object;
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
    window.renderDoenetEditorToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetEditorProps,
            keyboardIsOutsideIframe: true,
            // Callbacks have to be explicitly overridden here so that they
            // can message the parent React component (outside the iframe).
            doenetmlChangeCallback: (args: unknown) => {
                messageParentFromEditor({
                    callback: "doenetmlChangeCallback",
                    args,
                });
            },
            immediateDoenetmlChangeCallback: (args: unknown) => {
                messageParentFromEditor({
                    callback: "immediateDoenetmlChangeCallback",
                    args,
                });
            },
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
