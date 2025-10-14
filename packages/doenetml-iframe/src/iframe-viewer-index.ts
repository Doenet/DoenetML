// All code in this file will be executed in the context of an iframe
// created by DoenetViewer.
declare const viewerId: string;
declare const doenetViewerProps: object;
declare const haveViewerCallbacks: string[];
interface Window {
    renderDoenetViewerToContainer: (
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

    if (typeof window.renderDoenetViewerToContainer !== "function") {
        return messageParentFromViewer({
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
        "reportScoreAndStateCallback",
        "setIsInErrorState",
        "generatedVariantCallback",
        "documentStructureCallback",
        "initializedCallback",
        "setErrorsAndWarningsCallback",
    ];
    for (const callback of callbackNames) {
        callbackOverrides[callback] = haveViewerCallbacks.includes(callback)
            ? (args: unknown) => {
                  messageParentFromViewer({
                      callback,
                      args,
                  });
              }
            : undefined;
    }

    window.renderDoenetViewerToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetViewerProps,
            externalVirtualKeyboardProvided: true,
            ...callbackOverrides,
        },
    );
});

// The iframe forwards all SPLICE messages that aren't a response to its parent.
// Exception: SPLICE.submitAllAnswers is initiated by the app, so the logic is reversed.
// Do forward SPLICE.submitAllAnswers.response but don't forward SPLICE.submitAllAnswers
window.addEventListener("message", (e) => {
    if (e.origin !== window.parent.location.origin) {
        return;
    }
    if (
        e.data.subject?.startsWith("SPLICE") &&
        (!e.data.subject?.endsWith("response") ||
            e.data.subject.endsWith("submitAllAnswers.response")) &&
        !e.data.subject.endsWith("submitAllAnswers")
    ) {
        window.parent.postMessage(e.data);
    } else if (e.data.subject === "requestAnswerResponses") {
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
