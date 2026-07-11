import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// Flush-state-on-demand (Doenet/DoenetML#1440): a host posts
// `SPLICE.flushState` and receives `SPLICE.flushState.response` carrying the
// viewer's current serialized document state (the `initialState` shape) plus
// the current score. The guarantee under test: after the response, the host
// can unmount the viewer and later remount with `initialState: state`, and
// no student work is lost — including work performed AFTER the last
// throttled `reportScoreAndState` save event, which is exactly the gap this
// message closes.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;

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

describe("DoenetViewer flush-state-on-demand (#1440)", () => {
    it("flushed state restores un-saved work after an unmount/remount", () => {
        cy.mount(<DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />);

        // Type into the text input and commit the value (blur).
        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        cy.get("input.doenet-textinput, input:not([type=checkbox])")
            .type("kept across unmount")
            .blur();
        cy.contains("You typed: kept across unmount", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        // Flush: the response must carry restorable state.
        flushState("flush-test-1").then((response) => {
            expect(response.success, "flush success").to.eq(true);
            expect(response.state, "flushed state").to.not.eq(null);
            expect(response.state.coreState, "coreState").to.be.a("string");
            expect(response.state.coreInfo, "coreInfo").to.be.a("string");
            expect(response.score, "score").to.not.eq(undefined);

            // Unmount (cy.mount replaces the previous tree) and remount a
            // FRESH viewer seeded with the flushed state.
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    addVirtualKeyboard={false}
                    flags={{ allowLoadState: true }}
                    initialState={response.state}
                />,
            );

            // The typed value survives without any user interaction.
            cy.contains("You typed: kept across unmount", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.get("input.doenet-textinput, input:not([type=checkbox])").should(
                "have.value",
                "kept across unmount",
            );
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

        flushState("flush-test-2").then((response) => {
            expect(response.success, "flush success").to.eq(true);
            expect(response.state, "state").to.eq(null);
        });
    });
});
