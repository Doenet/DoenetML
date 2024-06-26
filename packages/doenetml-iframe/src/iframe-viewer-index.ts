// All code in this file will be executed in the context of an iframe
// created by DoenetViewerIframe.
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
    window.renderDoenetViewerToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetViewerProps,
            // Callbacks have to be explicitly overridden here so that they
            // can message the parent React component (outside the iframe).
            updateCreditAchievedCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "updateCreditAchievedCallback",
                    args,
                });
            },
            updateActivityStatusCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "updateActivityStatusCallback",
                    args,
                });
            },
            updateAttemptNumber: (args: unknown) => {
                messageParentFromViewer({
                    callback: "updateAttemptNumber",
                    args,
                });
            },
            pageChangedCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "pageChangedCallback",
                    args,
                });
            },
            cidChangedCallback: (args: unknown) => {
                messageParentFromViewer({
                    callback: "cidChangedCallback",
                    args,
                });
            },
            checkIfCidChanged: (args: unknown) => {
                messageParentFromViewer({
                    callback: "checkIfCidChanged",
                    args,
                });
            },
            setActivityAsCompleted: (args: unknown) => {
                messageParentFromViewer({
                    callback: "setActivityAsCompleted",
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
