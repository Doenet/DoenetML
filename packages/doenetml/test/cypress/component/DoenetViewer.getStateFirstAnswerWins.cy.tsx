import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { captureReports, flushState } from "./utils/splice";

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
const TEXT_INPUT = "input.doenet-textinput, input:not([type=checkbox])";

/** How long after the first answer the second answerer replies. */
const SECOND_ANSWER_DELAY = 500;

/**
 * Type `text` into the document and return the state a persistence host would
 * have saved for it.
 *
 * Routine state reports are throttled to one a minute
 * (`StatePersistence.saveChangesToDatabase`), so the flush is what makes the
 * capture deterministic: it pushes what the document is holding through the
 * ordinary `SPLICE.reportScoreAndState` channel a host saves from.
 */
function saveStateAfterTyping(reports: any[], text: string, flushId: string) {
    cy.get(TEXT_INPUT).type(`{selectall}{backspace}${text}{enter}`);
    cy.contains(`You typed: ${text}`, { timeout: VIEWER_TIMEOUT }).should(
        "exist",
    );
    flushState(flushId);
    return cy
        .wrap(null, { timeout: VIEWER_TIMEOUT })
        .should(() => {
            expect(
                reports.some((r) => String(r.state?.coreState).includes(text)),
                `a report carried "${text}"`,
            ).to.eq(true);
        })
        .then(
            () =>
                [...reports]
                    .reverse()
                    .find((r) => String(r.state?.coreState).includes(text))
                    .state,
        );
}

/**
 * Play two competing answerers for the next `SPLICE.getState`: reply at once
 * with `first`, then — once the request is out of the way — with `second`.
 *
 * A reply carries the request's own `message_id`, which is what makes it an
 * answer to the *same* request rather than stale traffic — unless it sets
 * `omitMessageId`, since the protocol specifies an error response as carrying
 * none (see the `SPLICE.getState` section of `@doenet/standalone`'s README).
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
            saveStateAfterTyping(reports, "round one", "capture-stale").then(
                (state) => {
                    this.staleState = state;
                },
            );
            saveStateAfterTyping(reports, "round two", "capture-fresh").then(
                (state) => {
                    this.freshState = state;
                },
            );
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
        // The reverse order. A protocol error carries no `message_id`, so it
        // never answers the request — it only puts the failure on screen,
        // leaving the request open for someone who does have state. When that
        // answer arrives the restored document has to replace the error
        // screen; the error is not this document's outcome, it was one
        // listener's.
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
