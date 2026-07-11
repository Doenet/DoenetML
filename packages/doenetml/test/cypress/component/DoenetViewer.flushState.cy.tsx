import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// Flush-state-on-demand (Doenet/DoenetML#1440): a host posts
// `SPLICE.flushState`; the viewer pushes any pending state through the normal
// `SPLICE.reportScoreAndState` pipeline (which a persistence host saves exactly
// as it does a routine autosave) and replies with a stateless
// `SPLICE.flushState.response` acknowledgement — the completion signal a
// lifecycle coordinator waits for before tearing the viewer down.
//
// The property under test is the one #1440 exists for: work performed AFTER
// the last (throttled) `reportScoreAndState` save event — i.e. work that would
// be silently LOST if the host unmounted based on save events alone — is
// pushed out by the flush and restorable via `initialState`. The first test
// proves it deterministically: the first commit's report is awaited, the
// second commit is then stuck behind the 60-second report throttle
// (`StatePersistence.saveChangesToDatabase`), so no report can deliver it
// before the flush; the test asserts the pre-flush reports lack the second
// value while the flush emits a report that contains it.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;
const TEXT_INPUT = "input.doenet-textinput, input:not([type=checkbox])";

/**
 * Post `SPLICE.flushState` and resolve with the matching acknowledgement.
 *
 * The request is re-posted every 500 ms until a response arrives, modelling
 * the recommended host behavior: the viewer's message listener registers in a
 * mount effect, so a request posted in the first moments after mount can land
 * before anyone is listening (and a robust host needs a retry/timeout around
 * the round-trip regardless — flushing is idempotent, so re-posting is safe).
 */
function flushState(messageId: string): Cypress.Chainable<any> {
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

/** Collect every `SPLICE.reportScoreAndState` posted by the viewer. */
function captureReports(): Cypress.Chainable<any[]> {
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

describe("DoenetViewer flush-state-on-demand (#1440)", () => {
    it("flushes throttle-stuck work through reportScoreAndState and restores it", () => {
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );

            cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should(
                "exist",
            );
            cy.get(TEXT_INPUT).type("first value{enter}");
            cy.contains("You typed: first value", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            // First flush: pushes a report through the normal pipeline and
            // deterministically arms the 60-second report throttle
            // (`StatePersistence.saveChangesToDatabase` re-arms its timer on
            // every override), regardless of boot-time save timing.
            flushState("flush-arm-throttle").then(() => {
                // Second commit: stuck behind the freshly-armed throttle — no
                // report can deliver it within this test's lifetime. This is
                // exactly the work an unmount would have lost.
                cy.get(TEXT_INPUT).type(
                    "{selectall}{backspace}work after last save{enter}",
                );
                cy.contains("You typed: work after last save", {
                    timeout: VIEWER_TIMEOUT,
                }).should("exist");

                // Snapshot the reports BEFORE posting the flush: the flush
                // itself pushes the pending save through the report pipeline
                // (by design), so only reports before this moment count as
                // "what an unmounting host would have had".
                cy.then(() => {
                    const reportsBeforeFlush = reports.slice();

                    flushState("flush-test-1").then((ack) => {
                        // The flush completed and reported it held state...
                        expect(ack.success, "flush success").to.eq(true);
                        expect(ack.hadState, "flush hadState").to.eq(true);

                        // ...reporting works (the first flush produced one),
                        // yet no PRE-flush report delivered the second commit.
                        expect(
                            reportsBeforeFlush.length,
                            "at least one report was delivered",
                        ).to.be.greaterThan(0);
                        expect(
                            reportsBeforeFlush.some((r) =>
                                String(r.state?.coreState).includes(
                                    "work after last save",
                                ),
                            ),
                            "second commit reported before flush (should not be)",
                        ).to.eq(false);
                    });

                    // ...but the flush pushed it out through the normal
                    // `reportScoreAndState` channel — the one a persistence
                    // host saves. Wait for that report, then rebuild a fresh
                    // viewer from the state it carried (as a host would),
                    // proving the otherwise-lost work is restored.
                    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                        expect(
                            reports.some((r) =>
                                String(r.state?.coreState).includes(
                                    "work after last save",
                                ),
                            ),
                            "flush pushed the pending work through reportScoreAndState",
                        ).to.eq(true);
                    });
                    cy.then(() => {
                        const flushed = [...reports]
                            .reverse()
                            .find((r) =>
                                String(r.state?.coreState).includes(
                                    "work after last save",
                                ),
                            );
                        cy.mount(
                            <DoenetViewer
                                doenetML={DOC}
                                addVirtualKeyboard={false}
                                flags={{ allowLoadState: true }}
                                initialState={flushed.state}
                            />,
                        );
                        cy.contains("You typed: work after last save", {
                            timeout: VIEWER_TIMEOUT,
                        }).should("exist");
                        cy.get(TEXT_INPUT).should(
                            "have.value",
                            "work after last save",
                        );
                    });
                });
            });
        });
    });

    it("acknowledges with hadState: false (still success) before any core exists", () => {
        // A viewer configured not to render never creates a core; flushing
        // must still respond — "nothing beyond initialization" — so hosts can
        // treat the unmount as safe.
        cy.mount(
            <DoenetViewer
                doenetML={DOC}
                addVirtualKeyboard={false}
                render={false}
            />,
        );

        flushState("flush-test-2").then((ack) => {
            expect(ack.success, "flush success").to.eq(true);
            expect(ack.hadState, "flush hadState").to.eq(false);
        });
    });
});
