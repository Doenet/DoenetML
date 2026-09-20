import React from "react";
import { DoenetViewer } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_BOOT_TIMEOUT,
    captureReports,
    flushStateViaHost,
    iframeBody,
    lastReportWith,
    reported,
    typeInViewer,
} from "./helpers";

// Flush-state-on-demand (Doenet/DoenetML#1440) through the FULL embedding
// chain: the host posts `SPLICE.flushState` on its own window, this wrapper
// forwards it into the srcdoc iframe, the viewer (running from the built
// @doenet/standalone bundle) pushes any pending state through the normal
// `SPLICE.reportScoreAndState` channel and replies with a stateless
// `SPLICE.flushState.response` acknowledgement — both reaching the host window
// directly (the viewer posts to `window.parent`).
//
// The property under test is the one #1440 exists for: work committed AFTER
// the last `reportScoreAndState` save event — provably undelivered, because an
// earlier flush armed the 60-second report throttle — is pushed out by the
// flush and restorable via `initialState`. The doenetml package has a sibling
// spec covering the in-process viewer plus the no-core case; this one covers
// the wrapper forwarding and the standalone-bundle path that production hosts
// actually use.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

describe("DoenetViewer (iframe wrapper) — flush-state-on-demand (#1440)", () => {
    it("flushes throttle-stuck work and restores it across an iframe teardown", () => {
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />,
            );

            iframeBody().should("contain.text", "Enter text:");
            typeInViewer("first value{enter}");
            iframeBody().should("contain.text", "You typed: first value");

            // First flush: pushes a report through the normal pipeline and
            // deterministically arms the 60-second report throttle.
            flushStateViaHost("iframe-flush-arm").then(() => {
                // Second commit: stuck behind the freshly-armed throttle — no
                // report can deliver it before the flush. This is exactly the
                // work tearing down the iframe would have lost.
                typeInViewer(
                    "{selectall}{backspace}survives the teardown{enter}",
                );
                iframeBody().should(
                    "contain.text",
                    "You typed: survives the teardown",
                );

                // Snapshot the reports BEFORE posting the flush: the flush
                // itself pushes the pending save through the report pipeline
                // (by design), so only reports before this moment count as
                // "what an unmounting host would have had".
                cy.then(() => {
                    const reportsBeforeFlush = reports.slice();

                    flushStateViaHost("iframe-flush-1").then((ack) => {
                        // The flush completed and reported it held state...
                        expect(ack.success, "flush success").to.eq(true);
                        expect(ack.hadState, "flush hadState").to.eq(true);

                        // ...yet no PRE-flush report delivered the second
                        // commit (reporting works — the first flush produced
                        // one).
                        expect(
                            reportsBeforeFlush.length,
                            "at least one report was delivered",
                        ).to.be.greaterThan(0);
                        expect(
                            reported(
                                reportsBeforeFlush,
                                "survives the teardown",
                            ),
                            "second commit reported before flush (should not be)",
                        ).to.eq(false);
                    });

                    // The flush pushed the pending work out through the normal
                    // `reportScoreAndState` channel — the one a persistence host
                    // saves. Wait for that report, then remount a FRESH iframe
                    // viewer seeded with the state it carried (as a host would);
                    // the otherwise-lost work survives with no user interaction.
                    cy.wrap(null, { timeout: IFRAME_BOOT_TIMEOUT }).should(
                        () => {
                            expect(
                                reported(reports, "survives the teardown"),
                                "flush pushed the pending work through reportScoreAndState",
                            ).to.eq(true);
                        },
                    );
                    cy.then(() => {
                        const flushed = lastReportWith(
                            reports,
                            "survives the teardown",
                        );
                        cy.mount(
                            <DoenetViewer
                                doenetML={DOC}
                                standaloneUrl={STANDALONE_BLOB_URL}
                                cssUrl={STANDALONE_CSS_BLOB_URL}
                                addVirtualKeyboard={false}
                                flags={{ allowLoadState: true }}
                                initialState={flushed.state}
                            />,
                        );
                        iframeBody().should(
                            "contain.text",
                            "You typed: survives the teardown",
                        );
                        iframeBody()
                            .find("input:not([type=checkbox])")
                            .should("have.value", "survives the teardown");
                    });
                });
            });
        });
    });
});
