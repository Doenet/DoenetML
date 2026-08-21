import React from "react";
import { DoenetViewer } from "../../../src/index";
import { STANDALONE_BLOB_URL, STANDALONE_CSS_BLOB_URL } from "./helpers";

// Flush pending state when the page hides (Doenet/DoenetML#1726), through the
// FULL embedding chain a PreTeXt or Runestone book uses: the viewer runs from
// the built @doenet/standalone bundle inside a srcdoc iframe and reports to
// `window.parent`.
//
// That cross-realm hop is the delicate part. `pagehide` can end a document as
// soon as the handler returns, and a `postMessage` only queues a task — a task
// an unloading document is destroyed before it ever runs. So the flush hands
// the host the same `SPLICE.reportScoreAndState` message by dispatching it
// directly on the parent window, which runs the host's listeners inline. This
// spec asserts exactly that: the report is in the host's hands by the time the
// dispatch returns, with no waiting.
//
// The sibling spec in the doenetml package covers the in-process viewer, where
// the hide flush stays within one realm.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const IFRAME_BOOT_TIMEOUT = 60_000;

/** Post `SPLICE.flushState` on the host window; resolve with its response. */
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

/** Collect every report the iframe's viewer delivers to this (host) window. */
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

function iframeBody() {
    return cy
        .get("iframe")
        .its("0.contentDocument.body", { timeout: IFRAME_BOOT_TIMEOUT });
}

function typeInViewer(text: string) {
    iframeBody().find("input:not([type=checkbox])").then(cy.wrap).type(text);
}

function reported(reports: any[], value: string) {
    return reports.some((r) => String(r.state?.coreState).includes(value));
}

describe("DoenetViewer (iframe wrapper) — flush-on-page-hide (#1726)", () => {
    it("hands the host throttle-stuck work while the page is still there", () => {
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />,
            );

            // Commit with Enter — Cypress cannot .blur() across the iframe
            // boundary.
            iframeBody().should("contain.text", "Enter text:");
            typeInViewer("first value{enter}");
            iframeBody().should("contain.text", "You typed: first value");

            // Arms the 60-second report throttle deterministically.
            flushStateViaHost("iframe-hide-arm").then(() => {
                // Everything from here is stuck behind that throttle: the work
                // a reader loses by closing the tab.
                typeInViewer(
                    "{selectall}{backspace}work after last save{enter}",
                );
                iframeBody().should(
                    "contain.text",
                    "You typed: work after last save",
                );

                // Past the one-second save debounce, so the payload has been
                // mirrored out of the worker and is waiting in the iframe's
                // main realm.
                cy.wait(2000);

                cy.get("iframe")
                    .its("0.contentWindow")
                    .then((iframeWin: Window) => {
                        expect(
                            reported(reports, "work after last save"),
                            "second commit reported before the page hid (should not be)",
                        ).to.eq(false);

                        iframeWin.dispatchEvent(
                            new (iframeWin as any).Event("pagehide"),
                        );

                        // No retry, no wait: if this needed either, an
                        // unloading document would never have delivered it.
                        expect(
                            reported(reports, "work after last save"),
                            "hiding delivered the pending work synchronously",
                        ).to.eq(true);
                    });

                // And a fresh viewer seeded with that state restores the work,
                // as a host would on the reader's next visit.
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
                            standaloneUrl={STANDALONE_BLOB_URL}
                            cssUrl={STANDALONE_CSS_BLOB_URL}
                            addVirtualKeyboard={false}
                            flags={{ allowLoadState: true }}
                            initialState={flushed.state}
                        />,
                    );
                    iframeBody().should(
                        "contain.text",
                        "You typed: work after last save",
                    );
                });
            });
        });
    });
});
