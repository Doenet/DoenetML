/**
 * Watch the DOM element for resize events and message its height to the parent
 * window. This class assumes we are in an iframe.
 *
 * Height reports are gated until the document has completed its first render
 * (see {@link markReady}). Before then — while the core worker is still booting,
 * or if it never boots at all — the watched container has a near-zero height,
 * and reporting it would collapse a host iframe that honors the resize protocol
 * (e.g. PreTeXt). See issue #1434.
 */
export class ResizeWatcher {
    elm: HTMLElement | null = null;
    resizeObserver: ResizeObserver | null = null;

    /**
     * Heights (in px, before the padding fudge below) at or under this floor are
     * treated as "not really rendered" and are never reported, even after
     * {@link markReady}. This keeps a failed or empty render from collapsing the
     * host iframe: the host keeps its placeholder size rather than shrinking to
     * a sliver.
     */
    static MIN_CONTENT_HEIGHT = 40;

    private ready = false;
    private lastObservedHeight = 0;

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
                this.lastObservedHeight = entry.contentRect.height;
                this.maybePost();
            }
        });
        this.resizeObserver.observe(elm);
    }

    /**
     * Signal that the document has completed its first render, so real content
     * heights may now be reported to the host. Also posts the current height
     * immediately, in case the resize that revealed the content already fired
     * before this signal arrived.
     */
    markReady() {
        this.ready = true;
        this.maybePost();
    }

    private maybePost() {
        if (
            !this.ready ||
            this.lastObservedHeight < ResizeWatcher.MIN_CONTENT_HEIGHT
        ) {
            return;
        }
        // SPLICE protocol message to the parent window
        window.parent.postMessage(
            {
                subject: "lti.frameResize",
                // There is extra padding in the iframe, so we add some extra pixels to compensate
                height: this.lastObservedHeight + 50,
            },
            "*",
        );
    }
}
