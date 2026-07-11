import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// Flush-state-on-demand (Doenet/DoenetML#1440): a host posts
// `SPLICE.flushState` and receives `SPLICE.flushState.response` carrying the
// viewer's current serialized document state (the `initialState` shape) plus
// the current score.
//
// The property under test is the one #1440 exists for: work performed AFTER
// the last (throttled) `reportScoreAndState` save event — i.e. work that
// would be silently LOST if the host unmounted based on save events alone —
// is carried by the flush response and restorable via `initialState`.
// The first test proves it deterministically: the first commit's report is
// awaited, the second commit is then stuck behind the 60-second report
// throttle (`StatePersistence.saveChangesToDatabase`), so no report can
// deliver it before the flush; the test asserts the last pre-flush report
// lacks the second value while the flush response contains it.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;
const TEXT_INPUT = "input.doenet-textinput, input:not([type=checkbox])";

/**
 * Post `SPLICE.flushState` and resolve with the matching response.
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
    it("flushes work stuck behind the report throttle and restores it", () => {
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

                    flushState("flush-test-1").then((response) => {
                        // Reporting works (the first flush produced one), yet
                        // no report delivered the second commit...
                        expect(
                            reportsBeforeFlush.length,
                            "at least one report was delivered",
                        ).to.be.greaterThan(0);
                        const preFlushReported = reportsBeforeFlush.some((r) =>
                            String(r.state?.coreState).includes(
                                "work after last save",
                            ),
                        );
                        expect(
                            preFlushReported,
                            "second commit reported before flush (should not be)",
                        ).to.eq(false);

                        // ...but the flush response carries it.
                        expect(response.success, "flush success").to.eq(true);
                        expect(response.state, "flushed state").to.not.eq(null);
                        expect(
                            String(response.state.coreState),
                            "flushed coreState",
                        ).to.include("work after last save");

                        // Unmount (cy.mount replaces the previous tree) and
                        // remount a FRESH viewer seeded with the flushed
                        // state: the otherwise-lost work is restored without
                        // interaction.
                        cy.mount(
                            <DoenetViewer
                                doenetML={DOC}
                                addVirtualKeyboard={false}
                                flags={{ allowLoadState: true }}
                                initialState={response.state}
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

    it("returns restorable state even with state saving disabled", () => {
        // With allowSaveState/allowLocalState off the normal save pipeline
        // never builds a payload (saveState returns before building), so this
        // deterministically distinguishes a real flush — which builds the
        // payload on demand — from any implementation that echoes the save
        // pipeline's last buffered/reported snapshot.
        cy.mount(
            <DoenetViewer
                doenetML={DOC}
                addVirtualKeyboard={false}
                flags={{ allowSaveState: false, allowLocalState: false }}
            />,
        );

        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        cy.get(TEXT_INPUT).type("never persisted{enter}");
        cy.contains("You typed: never persisted", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        flushState("flush-test-2").then((response) => {
            expect(response.success, "flush success").to.eq(true);
            expect(response.state, "flushed state").to.not.eq(null);
            expect(
                String(response.state.coreState),
                "flushed coreState",
            ).to.include("never persisted");

            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    addVirtualKeyboard={false}
                    flags={{ allowLoadState: true }}
                    initialState={response.state}
                />,
            );
            cy.contains("You typed: never persisted", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    it("responds with state: null (still success) before any core exists", () => {
        // A viewer configured not to render never creates a core; flushing
        // must still respond — "nothing beyond initialization" — so hosts
        // can treat the unmount as safe.
        cy.mount(
            <DoenetViewer
                doenetML={DOC}
                addVirtualKeyboard={false}
                render={false}
            />,
        );

        flushState("flush-test-3").then((response) => {
            expect(response.success, "flush success").to.eq(true);
            expect(response.state, "state").to.eq(null);
        });
    });
});
