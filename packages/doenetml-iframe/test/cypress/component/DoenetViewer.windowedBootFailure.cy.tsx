import React from "react";
import { DoenetViewer } from "../../../src/index";
import { __resetViewerLifecycleManagerForTests } from "../../../src/viewer-lifecycle-manager";
import {
    STANDALONE_CSS_BLOB_URL,
    STANDALONE_BLOB_URL,
    CONTENT_TIMEOUT,
} from "./helpers";

// The inline variant, for the same reason as `helpers.ts`: this source is
// evaluated from a Blob URL, where the code-split bundle's relative chunk
// imports cannot resolve.
// @ts-ignore - `?raw` returns a string; we don't ship types for it.
import STANDALONE_SOURCE from "@doenet/standalone/doenet-standalone-inline.js?raw";

// Boot-slot release on core-start failure (#1709), across the Comlink
// boundary: a windowed viewer whose embedded core cannot start reports
// `coreStartFailedCallback` out of its iframe, and the wrapper's composed
// callback frees the boot slot before forwarding to the host — so the next
// queued viewer boots right away instead of waiting out the 90 s
// BOOT_SLOT_WATCHDOG_MS.
//
// The failure is induced the same way the in-process coreStartFailed spec
// does it — `doenetGlobalConfig.__doenetTestCoreInitHook` hangs the worker
// handshake against a short single-attempt watchdog — but here the config
// lives inside viewer A's iframe realm. The standalone bundle creates
// `window.doenetGlobalConfig` as it evaluates, so the failing bundle is the
// real one with the config mutation appended: it runs as the last statements
// of the module, after the config object exists and before the boot script
// (a later module in document order) renders anything.

const FAILING_STANDALONE_BLOB_URL = URL.createObjectURL(
    new Blob(
        [
            STANDALONE_SOURCE,
            `
;window.doenetGlobalConfig.coreBootMaxAttempts = 1;
window.doenetGlobalConfig.coreHandshakeWatchdogMs = 500;
window.doenetGlobalConfig.__doenetTestCoreInitHook = (phase) =>
    phase === "handshake" ? new Promise(() => {}) : undefined;
`,
        ],
        { type: "application/javascript" },
    ),
);

// One boot slot page-wide, so viewer B can only boot once viewer A's slot is
// free. Both viewers stay within the live budget — only the boot cap is
// contended.
const MOUNT_POLICY = {
    mode: "windowed" as const,
    maxLiveViewers: 2,
    maxConcurrentBoots: 1,
    parkDelayMs: 300,
    visibleMargin: "100px",
};

const failures: unknown[] = [];

function Harness() {
    return (
        <div>
            {/* Fixed-height containers, both short enough to overlap a
                600px viewport, so A and B are visible together and both
                request a boot slot at mount (same layout reasoning as the
                lazyMount spec). A, first in document order, gets the slot. */}
            <div
                data-test="viewer-a"
                style={{ height: "250px", overflow: "hidden" }}
            >
                <DoenetViewer
                    doenetML={`<p>Viewer A never boots</p>`}
                    activityId="bootfail-act-A"
                    docId="bootfail-doc-A"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    coreStartFailedCallback={(arg: unknown) => {
                        failures.push(arg);
                    }}
                    standaloneUrl={FAILING_STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
            <div
                data-test="viewer-b"
                style={{ height: "250px", overflow: "hidden" }}
            >
                <DoenetViewer
                    doenetML={`<p>Viewer B content</p>`}
                    activityId="bootfail-act-B"
                    docId="bootfail-doc-B"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
        </div>
    );
}

/** Assert the viewer's document rendered the given text (see lazyMount). */
function assertRenders(which: string, text: string) {
    cy.get(`[data-test=${which}] iframe`, { timeout: CONTENT_TIMEOUT })
        .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
        .should((body: any) => {
            const clone = (body as HTMLElement).cloneNode(true) as HTMLElement;
            clone.querySelectorAll("script").forEach((s) => s.remove());
            expect(
                (clone.textContent ?? "").includes(text),
                `${which} rendered "${text}"`,
            ).to.eq(true);
        });
}

describe("DoenetViewer (iframe wrapper) — boot-slot release on core-start failure", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
        failures.length = 0;
    });

    it("frees the failed viewer's boot slot and forwards the failure to the host", () => {
        cy.viewport(900, 600);
        cy.mount(<Harness />);

        // The host hears the failure: the composed callback releases the
        // slot and then forwards to the callback passed as a prop, through
        // the Comlink proxy from inside viewer A's iframe.
        cy.wrap(null, { timeout: CONTENT_TIMEOUT }).should(() => {
            expect(
                failures.length,
                "host coreStartFailedCallback calls",
            ).to.be.greaterThan(0);
        });

        // Viewer A shows the inner viewer's give-up UI rather than content.
        assertRenders("viewer-a", "could not be started");

        // Viewer B, queued behind A on the single boot slot, boots and
        // renders well within CONTENT_TIMEOUT — far below the 90 s
        // BOOT_SLOT_WATCHDOG_MS, so the slot was freed by the failure
        // signal, not reclaimed by the watchdog.
        assertRenders("viewer-b", "Viewer B content");
    });
});
