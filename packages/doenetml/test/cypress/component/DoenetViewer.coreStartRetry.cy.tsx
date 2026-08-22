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

/** Hang every handshake for as long as `isStalled()` keeps saying so. */
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
        // And it is not wearing the failed attempt's error banner: what one
        // attempt could not start says nothing about the document that the
        // next one put on screen.
        cy.contains("This document contains errors").should("not.exist");

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

    it("withdraws the offer when a different error takes the pane over", () => {
        // The give-up screen outlives the failure it was raised for: the boot
        // never waited for the host's answer to `SPLICE.getState`, so a host
        // that cannot produce the saved work reports it onto whatever the
        // viewer is showing — here, a core start that had a retry left. The
        // button has to go with the message it belonged to. Restarting the
        // document would put the same question to the same host, so offering
        // it beside that answer is offering the reader nothing.
        giveUpQuickly();
        stallableHandshake(() => true);

        cy.mount(
            <DoenetViewer
                doenetML="<p>never boots</p>"
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        cy.contains("button", "Try again", { timeout: 8000 }).should("exist");

        // An error carrying no `message_id` is the shape the SPLICE protocol
        // specifies, and answers whichever request is open — this viewer's.
        cy.window().then((win) => {
            win.postMessage(
                {
                    subject: "SPLICE.getState.response",
                    error: {
                        code: 1,
                        message: "no saved state for this document",
                    },
                },
                "*",
            );
        });

        cy.contains("no saved state for this document", {
            timeout: 8000,
        }).should("exist");
        cy.contains("button", "Try again").should("not.exist");
    });

    it("offers a fresh retry once the document itself changes", () => {
        // The bound is one retry per document, not one per viewer. A viewer
        // outlives the document it failed on — an editor recompile, a host
        // swapping in the next activity — and a reader who spent their retry
        // on the first would otherwise never be offered another.
        giveUpQuickly();
        stallableHandshake(() => true);

        function Harness() {
            const [doenetML, setDoenetML] = React.useState("<p>first</p>");
            return (
                <div>
                    <button
                        type="button"
                        data-test="recompile"
                        onClick={() => setDoenetML("<p>second</p>")}
                    >
                        recompile
                    </button>
                    <DoenetViewer
                        doenetML={doenetML}
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        cy.contains("could not be started", { timeout: 8000 }).should("exist");
        cy.contains("button", "Try again").click();
        // Spent: this document's next failure is terminal.
        cy.contains("reload the page", { timeout: 8000 }).should("exist");

        cy.get('[data-test="recompile"]').click();

        // A different document, and its first failure gets its own offer.
        cy.contains("button", "Try again", { timeout: 8000 }).should("exist");
        cy.contains("reload the page").should("not.exist");
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
