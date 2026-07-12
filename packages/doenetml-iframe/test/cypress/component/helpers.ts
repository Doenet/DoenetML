// Shared helpers for the iframe-wrapper component tests.
//
// Importing the standalone bundle as `?raw` and turning it into a Blob URL is
// the same trick used by `src/test-main.tsx` so the iframe loads the
// locally-built version of @doenet/standalone instead of the CDN. (The
// `raw-large-bundle` plugin in cypress.config.ts handles the multi-MB string
// literal decoding.)

// @ts-ignore - `?raw` returns a string; we don't ship types for it.
import STANDALONE_SOURCE from "@doenet/standalone/doenet-standalone.js?raw";
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
