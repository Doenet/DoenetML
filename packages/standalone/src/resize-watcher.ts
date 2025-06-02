/**
 * Watch the DOM element for resize events and message them to the parent window.
 * This function assume we are in an iframe
 */
export class ResizeWatcher {
    elm: HTMLElement | null = null;
    resizeObserver: ResizeObserver | null = null;

    /**
     * Set the element to watch. This will unwatch any previously watched element.
     */
    watch(elm: HTMLElement) {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.elm = elm;
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                // SPLICE protocol messages to the parent window
                window.parent.postMessage(
                    {
                        subject: "lti.frameResize",
                        // There is extra padding in the iframe, so we add some extra pixels to compensate
                        height: height + 50,
                    },
                    "*",
                );
            }
        });
        this.resizeObserver.observe(elm);
    }
}
