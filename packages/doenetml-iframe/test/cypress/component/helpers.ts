// Shared helpers for the iframe-wrapper component tests.
//
// Importing the standalone bundle as `?raw` and turning it into a Blob URL is
// the same trick used by `src/test-main.tsx` so the iframe loads the
// locally-built version of @doenet/standalone instead of the CDN. (The
// `raw-large-bundle` plugin in cypress.config.ts handles the multi-MB string
// literal decoding.) It has to be the single-file inline variant: the regular
// `doenet-standalone.js` is code-split, and a bundle evaluated from a Blob URL
// has no base to resolve its relative chunk imports against.

// @ts-ignore - `?raw` returns a string; we don't ship types for it.
import STANDALONE_SOURCE from "@doenet/standalone/doenet-standalone-inline.js?raw";
// @ts-ignore
import STANDALONE_CSS from "@doenet/standalone/style.css?raw";

export const STANDALONE_BLOB_URL = URL.createObjectURL(
    new Blob([STANDALONE_SOURCE], { type: "application/javascript" }),
);
export const STANDALONE_CSS_BLOB_URL = URL.createObjectURL(
    new Blob([STANDALONE_CSS], { type: "text/css" }),
);

// The standalone JS bundle (~32 MB) takes a few seconds to evaluate inside
// the iframe; budget enough for that but no more — a failed wait costs the
// whole timeout, so keep it tight.
export const IFRAME_READY_TIMEOUT = 15_000;

// ---- Windowed-mounting (mountPolicy) spec helpers ----

// One shared policy for the windowed specs: a budget of one live viewer with
// a short park debounce, so parking is observable quickly.
export const WINDOWED_MOUNT_POLICY = {
    mode: "windowed" as const,
    maxLiveViewers: 1,
    parkDelayMs: 300,
    visibleMargin: "100px",
    flushTimeoutMs: 15_000,
};

// Booting a viewer renders real content; parking additionally waits for the
// realm to boot far enough to acknowledge the flush. Both need real time.
export const CONTENT_TIMEOUT = 40_000;
export const PARK_TIMEOUT = 40_000;

/** The iframe of the viewer inside the `[data-test=<which>]` container. */
export function viewerIframe(which: string) {
    return cy.get(`[data-test=${which}] iframe`);
}

/** Assert the viewer parked: placeholder present, iframe detached. */
export function assertParked(which: string) {
    cy.get(`[data-test=${which}] [data-doenet-parked-viewer]`, {
        timeout: PARK_TIMEOUT,
    }).should("exist");
    cy.get(`[data-test=${which}] iframe`).should("not.exist");
}

// A symbol we stash on the iframe's `contentDocument` to detect whether the
// iframe was reloaded (a full reload replaces `contentDocument`, so any
// property we added to the previous one is gone).
export const RELOAD_MARKER_KEY = "__doenetIframeReloadMarker";

// ---- SPLICE host-protocol helpers ----
//
// The spec plays the host: it owns the window the iframe's viewer reports to,
// so it can drive `SPLICE.flushState` and collect `SPLICE.reportScoreAndState`
// on that same window. (The `doenetml` package has the in-process equivalents
// in `test/cypress/component/utils/splice.ts`; these ones sit on the host side
// of the iframe boundary.)

/** Evaluating the standalone bundle inside the iframe takes real time. */
export const IFRAME_BOOT_TIMEOUT = 60_000;

/**
 * Post `SPLICE.flushState` on the host window and resolve with the matching
 * response. Re-posts every 500 ms until the response arrives — the
 * recommended host pattern (the viewer's listener registers on mount inside
 * the iframe, and flushing is idempotent, so re-posting is safe).
 */
export function flushStateViaHost(messageId: string): Cypress.Chainable<any> {
    return cy.window().then(
        (win) =>
            new Cypress.Promise((resolve) => {
                const post = () =>
                    win.postMessage(
                        { subject: "SPLICE.flushState", message_id: messageId },
                        "*",
                    );
                const retryTimer = setInterval(post, 500);
                const listener = (e: MessageEvent) => {
                    if (
                        e.data?.subject === "SPLICE.flushState.response" &&
                        e.data?.message_id === messageId
                    ) {
                        clearInterval(retryTimer);
                        win.removeEventListener("message", listener);
                        resolve(e.data);
                    }
                };
                win.addEventListener("message", listener);
                post();
            }),
    );
}

/**
 * Collect every `SPLICE.reportScoreAndState` the iframe's viewer delivers to
 * this (host) window, in arrival order.
 */
export function captureReports(): Cypress.Chainable<any[]> {
    return cy.window().then((win) => {
        const reports: any[] = [];
        win.addEventListener("message", (e: MessageEvent) => {
            if (e.data?.subject === "SPLICE.reportScoreAndState") {
                reports.push(e.data);
            }
        });
        return reports;
    });
}

/** Whether any captured report carries `value` in its serialized core state. */
export function reported(reports: any[], value: string): boolean {
    return reports.some((r) => String(r.state?.coreState).includes(value));
}

/** The most recent captured report carrying `value`, if any. */
export function lastReportWith(reports: any[], value: string) {
    return [...reports]
        .reverse()
        .find((r) => String(r.state?.coreState).includes(value));
}

/** The (same-origin srcdoc) iframe's body, once the viewer has rendered. */
export function iframeBody() {
    return cy
        .get("iframe")
        .its("0.contentDocument.body", { timeout: IFRAME_BOOT_TIMEOUT });
}

/**
 * Type into the viewer's text input inside the iframe. Commit with `{enter}`:
 * Cypress cannot `.blur()` across the iframe boundary.
 */
export function typeInViewer(text: string) {
    iframeBody().find("input:not([type=checkbox])").then(cy.wrap).type(text);
}
