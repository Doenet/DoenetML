import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Regression coverage: one boot ladder at a time per document.
//
// `DocViewer` launches `startCore` from render-phase code when a document
// prepared while `render` was false is finally wanted (stage
// `"readyToCreateCore"`). That stage is not left until the ladder finishes, so
// every re-render in the meantime revisits the launch site. A ladder spans a
// saved-state load, a worker handshake, and the document evaluation that
// follows, which makes that window wide enough for any ordinary re-render to
// land in it.
//
// A second ladder for the same document is the one supersession
// `bootAbandoned` cannot detect — the `coreId`s match, so neither twin stands
// aside — and both drive `reinitializeCoreAndTerminateAnimations`, which owns
// the single `coreWorker` ref, so each disposes the other's worker.

/**
 * Drives the render=true → render=false (with a new document) → render=true
 * sequence that is the only way to reach stage `"readyToCreateCore"`, plus a
 * "nudge" button that re-renders without changing anything the viewer would
 * rebuild for.
 */
function ParkUnparkHarness() {
    const [render, setRender] = React.useState(true);
    const [doenetML, setDoenetML] = React.useState("<p>first document</p>");
    const [, setNudge] = React.useState(0);
    return (
        <div>
            <button
                data-test="park"
                onClick={() => {
                    // Off-screen *and* a new document: that combination is
                    // what leaves the viewer parked at "readyToCreateCore".
                    setRender(false);
                    setDoenetML("<p>second document</p>");
                }}
            >
                park
            </button>
            <button data-test="unpark" onClick={() => setRender(true)}>
                unpark
            </button>
            <button data-test="nudge" onClick={() => setNudge((n) => n + 1)}>
                nudge
            </button>
            <DoenetViewer
                doenetML={doenetML}
                render={render}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetViewer boot ladder single-flight", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("re-rendering during a slow boot does not start a second ladder", () => {
        // One attempt, and a watchdog long enough that nothing in this test
        // expires: the stall is released by the test, not by a timeout.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 60_000;

        // Every handshake that reaches the seam is counted; while `stalling`
        // is set it also parks there, standing in for a boot that is waiting
        // on a slot or backing off.
        let handshakes = 0;
        let stalling = false;
        const stalled: (() => void)[] = [];
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase !== "handshake") {
                return;
            }
            handshakes++;
            if (!stalling) {
                return;
            }
            return new Promise<void>((resolve) => stalled.push(resolve));
        };

        cy.mount(<ParkUnparkHarness />);
        cy.contains("first document", { timeout: 20000 }).should("exist");

        cy.then(() => {
            handshakes = 0;
            stalling = true;
        });

        cy.get("[data-test=park]").click();
        // The park path is asynchronous (it hashes the source and consults
        // local state before parking the stage), so let it settle before the
        // unpark that reads the stage it leaves behind.
        cy.wait(1000);
        cy.get("[data-test=unpark]").click();

        // The one ladder the unpark is supposed to start.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(handshakes, "ladders started by the unpark").to.eq(1);
        });

        // Re-renders while that ladder is parked in its handshake. Each one
        // revisits the render-phase launch site.
        cy.get("[data-test=nudge]").click();
        cy.get("[data-test=nudge]").click();
        cy.get("[data-test=nudge]").click();
        cy.wait(1000);
        cy.then(() => {
            expect(handshakes, "ladders after three re-renders").to.eq(1);
        });

        // The surviving ladder still boots the document it was started for.
        cy.then(() => {
            stalling = false;
            stalled.forEach((resolve) => resolve());
        });
        cy.contains("second document", { timeout: 20000 }).should("exist");
    });
});
