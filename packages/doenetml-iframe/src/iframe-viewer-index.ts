// All code in this file will be executed in the context of an iframe
// created by DoenetViewer.
declare const viewerId: string;
declare const doenetViewerProps: object;
interface Window {
    renderDoenetViewerToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.renderDoenetViewerToContainer !== "function") {
        return messageParentFromViewer({
            error: "Invalid DoenetML version or DoenetML package not found",
        });
    }
    window.renderDoenetViewerToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetViewerProps,
            externalVirtualKeyboardProvided: true,
            // Callbacks have to be explicitly overridden here so that they
            // can message the parent React component (outside the iframe).
            updateCreditAchievedCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "updateCreditAchievedCallback",
                    args,
                });
            },
            updateAttemptNumber: (args: unknown) => {
                messageParentFromViewer({
                    callback: "updateAttemptNumber",
                    args,
                });
            },
            setIsInErrorState: (args: unknown) => {
                messageParentFromViewer({
                    callback: "setIsInErrorState",
                    args,
                });
            },
            generatedVariantCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "generatedVariantCallback",
                    args,
                });
            },
            setErrorsAndWarningsCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "setErrorsAndWarningsCallback",
                    args,
                });
            },
        },
    );
});

// forward all SPLICE messages that aren't a response to parent
window.addEventListener("message", (e) => {
    if (
        e.data.subject.startsWith("SPLICE") &&
        !e.data.subject.endsWith("response")
    ) {
        window.parent.postMessage(e.data);
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
