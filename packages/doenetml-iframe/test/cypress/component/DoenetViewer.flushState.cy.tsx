import React from "react";
import { DoenetViewer } from "../../../src/index";
import { STANDALONE_BLOB_URL, STANDALONE_CSS_BLOB_URL } from "./helpers";

// Flush-state-on-demand (Doenet/DoenetML#1440) through the FULL embedding
// chain: the host posts `SPLICE.flushState` on its own window, this wrapper
// forwards it into the srcdoc iframe, the viewer (running from the built
// @doenet/standalone bundle) answers once in-flight updates settle, and the
// response reaches the host window directly (the viewer posts to
// `window.parent`).
//
// The property under test is the one #1440 exists for: work committed AFTER
// the last `reportScoreAndState` save event — provably undelivered, because
// an earlier flush armed the 60-second report throttle — is carried by the
// flush response and restorable via `initialState`. The doenetml package has
// a sibling spec covering the in-process viewer plus the save-flags-disabled
// and no-core cases; this one covers the wrapper forwarding and the
// standalone-bundle path that production hosts actually use.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const IFRAME_BOOT_TIMEOUT = 60_000;

/**
 * Post `SPLICE.flushState` on the host window and resolve with the matching
 * response. Re-posts every 500 ms until the response arrives — the
 * recommended host pattern (the viewer's listener registers on mount inside
 * the iframe, and flushing is idempotent, so re-posting is safe).
 */
function flushStateViaHost(messageId: string): Cypress.Chainable<any> {
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

/**
 * Collect every `SPLICE.reportScoreAndState` the iframe's viewer posts to
 * this (host) window.
 */
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

/** The (same-origin srcdoc) iframe's body, once the viewer has rendered. */
function iframeBody() {
    return cy
        .get("iframe")
        .its("0.contentDocument.body", { timeout: IFRAME_BOOT_TIMEOUT });
}

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

            // Type into the viewer's text input inside the iframe and commit
            // with Enter (Cypress cannot .blur() across the iframe boundary).
            iframeBody().should("contain.text", "Enter text:");
            iframeBody()
                .find("input:not([type=checkbox])")
                .then(cy.wrap)
                .type("first value{enter}");
            iframeBody().should("contain.text", "You typed: first value");

            // First flush: pushes a report through the normal pipeline and
            // deterministically arms the 60-second report throttle.
            flushStateViaHost("iframe-flush-arm").then(() => {
                // Second commit: stuck behind the freshly-armed throttle — no
                // report can deliver it before the flush. This is exactly the
                // work tearing down the iframe would have lost.
                iframeBody()
                    .find("input:not([type=checkbox])")
                    .then(cy.wrap)
                    .type("{selectall}{backspace}survives the teardown{enter}");
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

                    flushStateViaHost("iframe-flush-1").then((response) => {
                        expect(
                            reportsBeforeFlush.length,
                            "at least one report was delivered",
                        ).to.be.greaterThan(0);
                        expect(
                            reportsBeforeFlush.some((r) =>
                                String(r.state?.coreState).includes(
                                    "survives the teardown",
                                ),
                            ),
                            "second commit reported before flush (should not be)",
                        ).to.eq(false);

                        expect(response.success, "flush success").to.eq(true);
                        expect(response.state, "flushed state").to.not.eq(null);
                        expect(
                            String(response.state.coreState),
                            "flushed coreState",
                        ).to.include("survives the teardown");

                        // Remount: a FRESH iframe viewer seeded with the
                        // flushed state (initialState and flags are
                        // serializable, so they ride into the srcdoc like any
                        // other viewer prop).
                        cy.mount(
                            <DoenetViewer
                                doenetML={DOC}
                                standaloneUrl={STANDALONE_BLOB_URL}
                                cssUrl={STANDALONE_CSS_BLOB_URL}
                                addVirtualKeyboard={false}
                                flags={{ allowLoadState: true }}
                                initialState={response.state}
                            />,
                        );

                        // The otherwise-lost work survives with no user
                        // interaction.
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
