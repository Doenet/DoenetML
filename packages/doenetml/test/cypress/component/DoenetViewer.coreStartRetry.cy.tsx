import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Component coverage for the retry control on a failed core start (#1712).
//
// The message a failed boot used to leave on screen advised reloading the
// page, which on the page that produced #1707 — a textbook section starting
// every activity at once on a slow machine — restarts every other document
// too. A retry starts one document over instead: no bundle re-parse, no
// realm reload.
//
// Failures are induced through the `__doenetTestCoreInitHook` seam, the same
// way DoenetViewer.coreStartFailed.cy.tsx drives the give-up ladder.

/** Hang the handshake until `stallHandshakes` is turned off. */
function stallableHandshake(isStalled: () => boolean) {
    doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
        if (phase === "handshake" && isStalled()) {
            return new Promise<void>(() => {
                /* never resolves */
            });
        }
    };
}

/** The failure the reader is looking at when they reach for the button. */
function giveUpQuickly() {
    doenetGlobalConfig.coreBootMaxAttempts = 1;
    doenetGlobalConfig.coreHandshakeWatchdogMs = 500;
}

/**
 * Lift the stall and the short watchdog together. The watchdog is what makes
 * the first attempt give up in half a second, but a *real* handshake (worker
 * boot plus WASM compile) needs far longer, so leaving it pinned would fail
 * the retry for reasons that have nothing to do with retrying.
 */
function letTheNextAttemptSucceed(stopStalling: () => void) {
    stopStalling();
    delete doenetGlobalConfig.coreHandshakeWatchdogMs;
}

describe("DoenetViewer core-start retry (#1712)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("puts the document on screen when the reader retries, without reloading anything", () => {
        giveUpQuickly();
        let stalled = true;
        stallableHandshake(() => stalled);

        let failures = 0;
        let initializations = 0;

        cy.mount(
            <DoenetViewer
                doenetML="<p>retried document</p>"
                addVirtualKeyboard={false}
                initializedCallback={() => {
                    initializations++;
                }}
                coreStartFailedCallback={() => {
                    failures++;
                }}
            />,
        );

        // The failure the button is offered on says nothing about reloading:
        // the button is the cheaper action, and a reader who reloads restarts
        // every other document on the page.
        cy.contains("could not be started", { timeout: 8000 }).should("exist");
        cy.contains("reload the page").should("not.exist");

        cy.then(() => letTheNextAttemptSucceed(() => (stalled = false)));
        cy.contains("button", "Try again").click();

        cy.contains("retried document", { timeout: 20000 }).should("exist");
        cy.contains("could not be started").should("not.exist");
        cy.contains("button", "Try again").should("not.exist");

        // The host hears one of each: the failure for the attempt that
        // failed, the initialization for the retry that did not. A second
        // failure report here would leave a coordinator holding the activity
        // as `failed` even though it now has a core.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(initializations, "initializedCallback calls").to.eq(1);
        });
        cy.then(() => {
            expect(failures, "coreStartFailedCallback calls").to.eq(1);
        });
    });

    it("falls back to the reload advice when the retry fails too, rather than looping", () => {
        // One retry, then the terminal message. A button that reappears after
        // every failure is a loop the reader cannot win, and by the second
        // failure reloading really is the next thing to try.
        giveUpQuickly();
        stallableHandshake(() => true);

        let failures = 0;

        cy.mount(
            <DoenetViewer
                doenetML="<p>never boots</p>"
                addVirtualKeyboard={false}
                coreStartFailedCallback={() => {
                    failures++;
                }}
            />,
        );

        cy.contains("could not be started", { timeout: 8000 }).should("exist");
        cy.contains("button", "Try again").click();

        // The retry runs a real ladder — the host hears its failure too,
        // which is what keeps a boot-scheduling host's books straight.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(failures, "coreStartFailedCallback calls").to.eq(2);
        });
        cy.contains("reload the page", { timeout: 8000 }).should("exist");
        cy.contains("button", "Try again").should("not.exist");
    });

    it("shows the retry working instead of blanking the pane", () => {
        // A document with nothing to render yet renders nothing, which is
        // right for a rebuild the reader did not ask for. For one they
        // clicked, it would look like the error had swallowed the activity.
        giveUpQuickly();
        let stalled = true;
        let releaseStateLoad: (() => void) | null = null;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "handshake" && stalled) {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
            if (phase === "stateLoad" && !stalled) {
                // Hold the retry open at its first await, so the pane it
                // shows meanwhile can be asserted on.
                return new Promise<void>((resolve) => {
                    releaseStateLoad = resolve;
                });
            }
        };

        cy.mount(
            <DoenetViewer
                doenetML="<p>slow retry</p>"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("could not be started", { timeout: 8000 }).should("exist");
        cy.then(() => letTheNextAttemptSucceed(() => (stalled = false)));
        cy.contains("button", "Try again").click();

        cy.contains("Initializing", { timeout: 8000 }).should("exist");
        cy.contains("could not be started").should("not.exist");

        cy.then(() => {
            releaseStateLoad?.();
        });
        cy.contains("slow retry", { timeout: 20000 }).should("exist");
    });

    it("stays out of the way of a document that boots", () => {
        let failures = 0;

        cy.mount(
            <DoenetViewer
                doenetML="<p>boots fine</p>"
                addVirtualKeyboard={false}
                coreStartFailedCallback={() => {
                    failures++;
                }}
            />,
        );

        cy.contains("boots fine", { timeout: 20000 }).should("exist");
        cy.contains("button", "Try again").should("not.exist");
        cy.then(() => {
            expect(failures, "coreStartFailedCallback calls").to.eq(0);
        });
    });
});
