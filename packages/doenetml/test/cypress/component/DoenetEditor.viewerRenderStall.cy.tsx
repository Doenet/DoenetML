import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Regression coverage for the "editor renders but viewer never does" stall
// (Doenet/DoenetApps#2957) AND its follow-up: don't conflate a slow core with
// a hung one.
//
// Two distinct core-init phases (see DocViewer.startCore):
//   - "handshake": (re)create the worker + cheap, size-independent init
//     round-trips. A #2957 stall lives here (worker silent). This phase IS
//     watchdogged + retried.
//   - "generate": the actual evaluation. Legitimately slow on complex
//     documents (seconds to minutes). This phase is NOT watchdogged — once the
//     handshake succeeds the worker has proven it is alive.
//
// Both phases are driven deterministically through the
// `doenetGlobalConfig.__doenetTestCoreInitHook` seam (inert in production)
// rather than relying on flaky CPU throttling or real slow documents.

const SAMPLE_DOENETML = "<p>hello viewer</p>";

function Harness() {
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <DoenetEditor
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetEditor viewer render stall (#2957)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("baseline: viewer renders without any injected fault", () => {
        cy.mount(<Harness />);

        cy.get(".cm-editor", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer").should("contain.text", "hello viewer");
    });

    it("recovers from a hung handshake (watchdog + retry)", () => {
        let handshakeAttempts = 0;
        // Hang forever on the first handshake attempt (emulates a worker whose
        // boot round-trip never settles under load); let later attempts and
        // the evaluation phase proceed.
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase, attempt) => {
            if (phase === "handshake") {
                handshakeAttempts = Math.max(handshakeAttempts, attempt + 1);
                if (attempt === 0) {
                    return new Promise<void>(() => {
                        /* never resolves */
                    });
                }
            }
        };
        // Generous enough that the real first handshake completes before the
        // injected hang, so the watchdog fires on the *hang*, not on a
        // slow-but-healthy handshake.
        doenetGlobalConfig.coreHandshakeWatchdogMs = 4000;

        cy.mount(<Harness />);

        // Editor shell still comes up immediately.
        cy.get(".cm-editor", { timeout: 20000 }).should("exist");

        // The watchdog + retry recovers and the viewer renders. (Pre-fix the
        // first handshake hung forever and the viewer stayed blank.)
        cy.get(".doenet-viewer", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer").should("contain.text", "hello viewer");

        cy.then(() => {
            expect(
                handshakeAttempts,
                "handshake was retried after the hung first attempt",
            ).to.be.greaterThan(1);
        });
    });

    it("recovers from a rejected handshake (retry)", () => {
        let handshakeAttempts = 0;
        // Reject the first handshake synchronously (emulates a transient
        // WASM-init/throw); a reject should retry immediately without waiting
        // for the watchdog.
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase, attempt) => {
            if (phase === "handshake") {
                handshakeAttempts = Math.max(handshakeAttempts, attempt + 1);
                if (attempt === 0) {
                    throw new Error("simulated transient handshake failure");
                }
            }
        };
        // Long watchdog so this proves the retry came from the *reject*, not a
        // timeout.
        doenetGlobalConfig.coreHandshakeWatchdogMs = 60000;

        cy.mount(<Harness />);

        cy.get(".cm-editor", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer").should("contain.text", "hello viewer");

        cy.then(() => {
            expect(
                handshakeAttempts,
                "handshake was retried after the rejected first attempt",
            ).to.be.greaterThan(1);
        });
    });

    it("surfaces a visible error when every handshake attempt fails", () => {
        // Hang on every handshake attempt: the viewer must give up and show an
        // error rather than stalling silently with a blank pane.
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "handshake") {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
        };
        doenetGlobalConfig.coreHandshakeWatchdogMs = 2000;
        doenetGlobalConfig.coreBootMaxAttempts = 2;

        cy.mount(<Harness />);

        // Editor unaffected.
        cy.get(".cm-editor", { timeout: 20000 }).should("exist");

        // A visible error is surfaced (2 attempts × 2s watchdog ≈ 4s).
        cy.contains(/reload the page/i, { timeout: 20000 }).should("exist");

        // And it is an error, not a silently-rendered empty viewer.
        cy.get(".doenet-viewer").should("not.exist");
    });

    it("does not abort a slow-but-alive evaluation", () => {
        // The crux of the #2957 follow-up: a long evaluation must NOT be killed
        // by the handshake watchdog. Here the handshake is healthy/fast but the
        // evaluation takes far longer than the (deliberately short) handshake
        // watchdog. A total-elapsed watchdog over the boot would abort this and
        // make the document unloadable; a handshake-only watchdog must let it
        // finish.
        let generatePhaseRan = false;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "generate") {
                generatePhaseRan = true;
                return new Promise<void>((resolve) =>
                    setTimeout(resolve, 4000),
                );
            }
        };
        // Short watchdog: the real ~hundreds-of-ms handshake fits comfortably,
        // but the 4s evaluation delay does NOT — so if the watchdog covered the
        // evaluation, the load would be aborted.
        doenetGlobalConfig.coreHandshakeWatchdogMs = 2500;

        cy.mount(<Harness />);

        cy.get(".cm-editor", { timeout: 20000 }).should("exist");

        // Evaluation runs long but the viewer still renders.
        cy.get(".doenet-viewer", { timeout: 20000 }).should("exist");
        cy.get(".doenet-viewer").should("contain.text", "hello viewer");

        cy.then(() => {
            expect(generatePhaseRan, "evaluation phase ran").to.be.true;
        });
    });
});
