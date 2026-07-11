import React from "react";
import { DoenetViewer } from "../../../src/index";
import { STANDALONE_BLOB_URL, STANDALONE_CSS_BLOB_URL } from "./helpers";

// Flush-state-on-demand (Doenet/DoenetML#1440) through the FULL embedding
// chain: the host posts `SPLICE.flushState` on its own window, this wrapper
// forwards it into the srcdoc iframe, the viewer (running from the built
// @doenet/standalone bundle) answers once in-flight updates settle, and the
// response reaches the host window directly (the viewer posts to
// `window.parent`). The guarantee under test: unmount the iframe viewer after
// the response, remount with `initialState: state`, and the student's work —
// including work never delivered by a throttled save event — is restored.
//
// The doenetml package has a sibling spec covering the in-process viewer;
// this one covers the wrapper forwarding and the standalone-bundle path that
// production hosts (doenet.org, PreTeXt-style pages) actually use.

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

/** The (same-origin srcdoc) iframe's body, once the viewer has rendered. */
function iframeBody() {
    return cy
        .get("iframe")
        .its("0.contentDocument.body", { timeout: IFRAME_BOOT_TIMEOUT });
}

describe("DoenetViewer (iframe wrapper) — flush-state-on-demand (#1440)", () => {
    it("flush → unmount → remount with initialState restores the work", () => {
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
        // Same-origin srcdoc, so Cypress can reach in directly.
        iframeBody().should("contain.text", "Enter text:");
        iframeBody()
            .find("input:not([type=checkbox])")
            .then(cy.wrap)
            .type("survives the iframe teardown{enter}");
        iframeBody().should(
            "contain.text",
            "You typed: survives the iframe teardown",
        );

        // Flush from the HOST window; the wrapper forwards the request into
        // the iframe and the viewer's response comes back to this window.
        flushStateViaHost("iframe-flush-1").then((response) => {
            expect(response.success, "flush success").to.eq(true);
            expect(response.state, "flushed state").to.not.eq(null);
            expect(response.state.coreState, "coreState").to.be.a("string");

            // Remount: a FRESH iframe viewer seeded with the flushed state
            // (initialState and flags are serializable, so they ride into
            // the srcdoc like any other viewer prop).
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

            // The typed value survives with no user interaction.
            iframeBody().should(
                "contain.text",
                "You typed: survives the iframe teardown",
            );
            iframeBody()
                .find("input:not([type=checkbox])")
                .should("have.value", "survives the iframe teardown");
        });
    });
});
