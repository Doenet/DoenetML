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

// A symbol we stash on the iframe's `contentDocument` to detect whether the
// iframe was reloaded (a full reload replaces `contentDocument`, so any
// property we added to the previous one is gone).
export const RELOAD_MARKER_KEY = "__doenetIframeReloadMarker";
