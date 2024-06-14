import React from "react";

/**
 * Watch `ref` for any changes in size and update `setHeight` accordingly.
 */
export function watchForResize(
    ref: React.RefObject<HTMLIFrameElement>,
    getHeight: () => string,
    setHeight: React.Dispatch<React.SetStateAction<string>>,
): () => void {
    const iframe = ref.current?.contentWindow?.document?.body?.parentElement;
    if (!iframe) {
        return () => {};
    }
    setHeight(iframe.scrollHeight + "px");

    const updateHeight = () => {
        const iframe =
            ref.current?.contentWindow?.document?.body?.parentElement;
        if (!iframe) {
            return;
        }
        const newHeight = iframe.scrollHeight + "px";
        if (newHeight !== getHeight()) {
            setHeight(newHeight);
        }
    };

    const observer = new MutationObserver(updateHeight);
    observer.observe(iframe, {
        attributes: true,
        childList: true,
        subtree: true,
    });

    // The mutation observer might not catch all resize changes, so we poll as well.
    const interval = setInterval(updateHeight, 200);

    return () => {
        observer.disconnect();
        clearInterval(interval);
    };
}
