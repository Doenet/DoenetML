// All code in this file will be executed in the context of an iframe
// created by DoenetMLIframe.
declare const id: string;
declare const doenetMLProps: object;
interface Window {
    renderDoenetToContainer: (
        container: Element,
        doenetMLSource?: string,
        config?: object,
    ) => void;
}

document.addEventListener("DOMContentLoaded", () => {
    window.renderDoenetToContainer(
        document.getElementById("root")!,
        undefined,
        {
            ...doenetMLProps,
            // Callbacks have to be explicitly overridden here so that they
            // can message the parent React component (outside the iframe).
            generatedVariantCallback: (variant: unknown) => {
                messageParent({ generatedVariantCallback: variant });
            },
        },
    );
});

/**
 * Send a message to the parent React component.
 * @param data
 */
function messageParent(data: any) {
    window.parent.postMessage(
        {
            origin: id,
            data,
        },
        window.parent.origin,
    );
}
