import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import {
    captureReports,
    saveStateAfterTyping,
    TEXT_INPUT,
} from "./utils/splice";

// One `SPLICE.getState` request, one answer.
//
// A page can hold more than one listener willing to answer a viewer's request
// for its saved state: under the `@doenet/standalone` coordinator the in-page
// warehouse answers a restored activity, while the book's own persistence
// layer (Runestone, a SCORM package) answers the same request out of durable
// storage. Every answer used to be processed, so the document was rebuilt from
// whichever landed LAST — and the durable answer, a round trip to storage,
// generally lands second while carrying older work than the reader has just
// done.
//
// `cypress/e2e/standalone/coordinatorPersistenceHost.cy.js` in
// `@doenet/test-cypress` builds that page for real; these tests pin the rule
// itself down at the viewer, where the two answers can be ordered exactly.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;

/** How long after the first answer the second answerer replies. */
const SECOND_ANSWER_DELAY = 500;

/**
 * Play two competing answerers for the next `SPLICE.getState`: reply at once
 * with `first`, then — once the request is out of the way — with `second`.
 *
 * A reply carries the request's own `message_id`, which is what makes it an
 * answer to the request the viewer has open rather than to one a rebuild has
 * replaced — unless it sets `omitMessageId`, the shape the protocol specifies
 * for an error response, which the viewer also reads as answering the open
 * request (see the `SPLICE.getState` section of `@doenet/standalone`'s README,
 * and `DoenetViewer.getStateError.cy.tsx` for both error shapes).
 * Resolves with a flag object whose `sent` turns true when the second reply
 * has gone out.
 */
function answerGetStateTwice(
    first: Record<string, unknown>,
    second: Record<string, unknown>,
) {
    return cy.window().then((win) => {
        const secondAnswer = { sent: false };
        const listener = (e: MessageEvent) => {
            if (e.data?.subject !== "SPLICE.getState") {
                return;
            }
            // Answer one request; a rebuild would ask again.
            win.removeEventListener("message", listener);
            const message_id = e.data.message_id;
            const send = ({ omitMessageId, ...reply }: any) =>
                win.postMessage(
                    {
                        subject: "SPLICE.getState.response",
                        ...(omitMessageId ? {} : { message_id }),
                        ...reply,
                    },
                    "*",
                );
            send(first);
            setTimeout(() => {
                send(second);
                secondAnswer.sent = true;
            }, SECOND_ANSWER_DELAY);
        };
        win.addEventListener("message", listener);
        return secondAnswer;
    });
}

/**
 * Wait until the second answer has been sent and the viewer has had time to
 * act on it.
 *
 * Adopting an answer clears the rendered document before rebuilding
 * (`setDocumentRenderer(null)`), so once this returns, a viewer that took the
 * second answer cannot still be showing the first one's document — which is
 * what keeps the assertions from passing by beating the rebuild.
 */
function afterSecondAnswer(secondAnswer: { sent: boolean }) {
    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
        expect(secondAnswer.sent, "second answer sent").to.eq(true);
    });
    cy.wait(1000);
}

describe("DoenetViewer SPLICE.getState with more than one answerer", () => {
    beforeEach(function () {
        // Two states for the same document — the same `cid`, so both are
        // answers this viewer can use, differing only in how much of the
        // reader's work they hold. The stale one is what a persistence host
        // that has fallen behind would answer with.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );
            cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should(
                "exist",
            );
            saveStateAfterTyping(
                reports,
                "round one",
                "capture-stale",
                VIEWER_TIMEOUT,
            ).then((state) => {
                this.staleState = state;
            });
            saveStateAfterTyping(
                reports,
                "round two",
                "capture-fresh",
                VIEWER_TIMEOUT,
            ).then((state) => {
                this.freshState = state;
            });
        });
    });

    it("keeps the first answer's state when a later answer carries older work", function () {
        answerGetStateTwice(
            { state: this.freshState },
            { state: this.staleState },
        ).then((secondAnswer) => {
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    addVirtualKeyboard={false}
                    flags={{ allowLoadState: true }}
                />,
            );

            cy.contains("You typed: round two", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            afterSecondAnswer(secondAnswer);

            // The reader keeps what they had done, and the document was not
            // rebuilt a second time to get there.
            cy.get(TEXT_INPUT).should("have.value", "round two");
            cy.contains("You typed: round one").should("not.exist");
        });
    });

    it("ignores a later answerer's error once state has been adopted", function () {
        // The second answerer has nothing for this activity and says so. That
        // is not this document's problem — it has already been restored — and
        // the viewer must not replace it with an error screen.
        answerGetStateTwice(
            { state: this.freshState },
            { error: { code: 404, message: "no state for this activity" } },
        ).then((secondAnswer) => {
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    addVirtualKeyboard={false}
                    flags={{ allowLoadState: true }}
                />,
            );

            cy.contains("You typed: round two", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            afterSecondAnswer(secondAnswer);

            cy.contains("no state for this activity").should("not.exist");
            cy.get(TEXT_INPUT).should("have.value", "round two");
        });
    });

    it("clears an earlier answerer's error once a later answer restores the document", function () {
        // The reverse order. An error never consumes the request — only
        // usable state does, whatever `message_id` the error carries — so it
        // does no more than put the failure on screen, leaving the request
        // open for someone who does have state. When that answer arrives the
        // restored document has to replace the error screen; the error is not
        // this document's outcome, it was one listener's.
        answerGetStateTwice(
            {
                error: { code: 500, message: "storage unavailable" },
                omitMessageId: true,
            },
            { state: this.freshState },
        ).then((secondAnswer) => {
            cy.mount(
                <DoenetViewer
                    doenetML={DOC}
                    addVirtualKeyboard={false}
                    flags={{ allowLoadState: true }}
                />,
            );

            afterSecondAnswer(secondAnswer);

            cy.contains("storage unavailable").should("not.exist");
            cy.contains("You typed: round two", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.get(TEXT_INPUT).should("have.value", "round two");
        });
    });
});
