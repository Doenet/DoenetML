// All code in this file will be executed in the context of an iframe
// created by DoenetViewer.
declare const viewerId: string;
declare const doenetViewerProps: Record<string, any>;
declare const doenetViewerPropsSpecified: string[];
declare const ComlinkViewer: { wrap: Function; windowEndpoint: Function };
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

    // Reconstruct the props from the serialized doenetViewerProps (from which functions have disappeared)
    // and the ComLink proxied functions.
    // Only include the ComLink proxies if the prop was actually specified,
    // so that the DoenetViewer can customize behavior based on the presence of callbacks.
    const wrappedDoenetViewerProps = ComlinkViewer.wrap(
        ComlinkViewer.windowEndpoint(globalThis.parent),
    );

    const augmentedDoenetViewerProps = { ...doenetViewerProps };
    augmentedDoenetViewerProps.externalVirtualKeyboardProvided = true;
    for (const propName of doenetViewerPropsSpecified) {
        if (!(propName in doenetViewerProps)) {
            augmentedDoenetViewerProps[propName] =
                wrappedDoenetViewerProps[propName];
        }
    }

    window.renderDoenetViewerToContainer(
        document.getElementById("root")!,
        undefined,
        augmentedDoenetViewerProps,
    );
});

// forward all SPLICE messages that aren't a response to parent
window.addEventListener("message", (e) => {
    if (e.origin !== window.parent.location.origin) {
        return;
    }
    if (
        e.data.subject?.startsWith("SPLICE") &&
        !e.data.subject?.endsWith("response")
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
